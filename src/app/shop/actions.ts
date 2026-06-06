"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  cartItems,
  carts,
  orderItems,
  orders,
  products,
  userBalances,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";

async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Not authenticated");
  return session;
}

async function getOrCreateCart(userId: string) {
  const existing = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);
  if (existing[0]) return existing[0];

  const [cart] = await db.insert(carts).values({ userId }).returning();
  return cart;
}

export async function addToCart(productId: number) {
  const session = await requireSession();
  const cart = await getOrCreateCart(session.user.id);

  const product = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.active, true)))
    .limit(1);
  if (!product[0]) throw new Error("Product not found");

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
    )
    .limit(1);

  if (existingItem[0]) {
    await db
      .update(cartItems)
      .set({ quantity: existingItem[0].quantity + 1 })
      .where(eq(cartItems.id, existingItem[0].id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      productId,
      quantity: 1,
    });
  }

  revalidatePath("/platform/shop");
}

export async function removeFromCart(cartItemId: number) {
  const session = await requireSession();
  const cart = await getOrCreateCart(session.user.id);

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, cart.id)));

  revalidatePath("/platform/shop");
}

type Address = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

type CheckoutItem = {
  productId: number;
  quantity: number;
};

export async function placeOrder(
  checkoutItems: CheckoutItem[],
  address: Address,
) {
  const session = await requireSession();

  const normalizedItems = checkoutItems
    .map((item) => ({
      productId: Number(item.productId),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 0)),
    }))
    .filter((item) => item.productId > 0 && item.quantity > 0);

  if (normalizedItems.length === 0) throw new Error("Cart is empty");

  const productRows = await db
    .select({
      productId: products.id,
      productName: products.name,
      unitPrice: products.price,
      stock: products.stock,
    })
    .from(products)
    .where(eq(products.active, true));

  const quantityByProduct = new Map<number, number>();
  for (const item of normalizedItems) {
    quantityByProduct.set(
      item.productId,
      (quantityByProduct.get(item.productId) ?? 0) + item.quantity,
    );
  }

  const items = productRows
    .filter((product) => quantityByProduct.has(product.productId))
    .map((product) => ({
      ...product,
      quantity: quantityByProduct.get(product.productId) ?? 0,
    }));

  if (items.length === 0) throw new Error("Cart is empty");

  const unavailableItem = items.find(
    (item) => item.stock !== null && item.quantity > item.stock,
  );
  if (unavailableItem) {
    throw new Error(
      `${unavailableItem.productName} only has ${unavailableItem.stock} left.`,
    );
  }

  const totalCost = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const balance = await db
    .select()
    .from(userBalances)
    .where(eq(userBalances.userId, session.user.id))
    .limit(1);

  if (balance[0] && balance[0].balance < totalCost) {
    throw new Error(
      `Insufficient balance. You have ${balance[0].balance} credits, need ${totalCost}.`,
    );
  }

  const existingOrder = await db
    .select()
    .from(orders)
    .where(
      and(eq(orders.userId, session.user.id), eq(orders.status, "pending")),
    )
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(1);

  let orderId = 0;

  if (existingOrder[0]) {
    orderId = existingOrder[0].id;
    await db
      .update(orders)
      .set({
        totalCost: existingOrder[0].totalCost + totalCost,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));
  } else {
    const [order] = await db.transaction(async (tx) => {
      for (const item of items) {
        if (item.stock === null) continue;
        const [updatedProduct] = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(
            and(
              eq(products.id, item.productId),
              eq(products.active, true),
              sql`${products.stock} IS NOT NULL`,
              sql`${products.stock} >= ${item.quantity}`,
            ),
          )
          .returning({ id: products.id });

        if (!updatedProduct) {
          throw new Error(`${item.productName} is no longer in stock.`);
        }
      }

      if (balance[0]) {
        await tx
          .update(userBalances)
          .set({ balance: balance[0].balance - totalCost })
          .where(eq(userBalances.id, balance[0].id));
      }

      const [order] = await tx
        .insert(orders)
        .values({
          userId: session.user.id,
          totalCost,
          shippingName: address.name,
          shippingLine1: address.line1,
          shippingLine2: address.line2,
          shippingCity: address.city,
          shippingRegion: address.region,
          shippingPostalCode: address.postalCode,
          shippingCountry: address.country,
        })
        .returning();

      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
      }

      return [order];
    });
    orderId = order.id;

    revalidatePath("/platform/shop/orders");
    revalidatePath("/platform/shop");
    return { orderId, totalCost, merged: false };
  }

  await db.transaction(async (tx) => {
    for (const item of items) {
      if (item.stock === null) continue;
      const [updatedProduct] = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(
          and(
            eq(products.id, item.productId),
            eq(products.active, true),
            sql`${products.stock} IS NOT NULL`,
            sql`${products.stock} >= ${item.quantity}`,
          ),
        )
        .returning({ id: products.id });

      if (!updatedProduct) {
        throw new Error(`${item.productName} is no longer in stock.`);
      }
    }

    if (balance[0]) {
      await tx
        .update(userBalances)
        .set({ balance: balance[0].balance - totalCost })
        .where(eq(userBalances.id, balance[0].id));
    }

    for (const item of items) {
      const existingOrderItem = await tx
        .select()
        .from(orderItems)
        .where(
          and(
            eq(orderItems.orderId, orderId),
            eq(orderItems.productId, item.productId),
          ),
        )
        .limit(1);

      if (existingOrderItem[0]) {
        await tx
          .update(orderItems)
          .set({ quantity: existingOrderItem[0].quantity + item.quantity })
          .where(eq(orderItems.id, existingOrderItem[0].id));
      } else {
        await tx.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
      }
    }
  });

  revalidatePath("/platform/shop/orders");
  revalidatePath("/platform/shop");
  return { orderId, totalCost, merged: true };
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "being_fulfilled" | "sent" | "cancelled",
  trackingInfo?: string,
  adminNotes?: string,
) {
  const session = await requireSession();
  if (!(await isAdminSession(session))) {
    throw new Error("Admin access required");
  }

  await db
    .update(orders)
    .set({
      status,
      ...(trackingInfo !== undefined ? { trackingInfo } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  revalidatePath("/platform/admin/orders");
  revalidatePath("/platform/admin/fulfillment");
  revalidatePath("/platform/shop/orders");
}

export async function cancelOrder(orderId: number) {
  const session = await requireSession();

  const existingOrder = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
    .limit(1);

  const order = existingOrder[0];
  if (!order) throw new Error("Order not found");
  if (order.status !== "pending") {
    throw new Error("Only pending orders can be cancelled");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)));

    const balance = await tx
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, session.user.id))
      .limit(1);

    if (balance[0]) {
      await tx
        .update(userBalances)
        .set({
          balance: balance[0].balance + order.totalCost,
          updatedAt: new Date(),
        })
        .where(eq(userBalances.id, balance[0].id));
    } else {
      await tx.insert(userBalances).values({
        userId: session.user.id,
        balance: order.totalCost,
      });
    }
  });

  revalidatePath("/platform/shop/orders");
  revalidatePath("/platform/admin/orders");
}

export async function seedProducts() {
  const existing = await db.select().from(products).limit(1);
  if (existing.length > 0) return;

  const shopItems = [
    {
      name: "Perfboard",
      description: "Prototype your circuits on a solderable perfboard.",
      imageUrl:
        "https://cdn.hackclub.com/019d17df-1e6d-76fa-a1e7-4dfc97646ede/image.png",
      price: 3,
    },
    {
      name: "Soldering Iron",
      description: "A reliable soldering iron for joining components.",
      imageUrl:
        "https://cdn.hackclub.com/019d17df-2275-77e8-8ac7-6b4cbab4cc7c/s-l1200.jpg",
      price: 5,
    },
    {
      name: "Multimeter",
      description: "Measure voltage, current, and resistance with confidence.",
      imageUrl:
        "https://cdn.hackclub.com/019d17df-2486-7422-8cc5-ac68e256bf65/image.png",
      price: 4,
    },
    {
      name: "$10 PCB Grant",
      description:
        "Get $10 toward a custom PCB order. Stack with other Hack Club grants.",
      imageUrl:
        "https://cdn.hackclub.com/019d17df-269f-7f0a-8274-ab4e8638f64f/pcb_10.webp",
      price: 8,
    },
    {
      name: "Stickers",
      description: "A pile of Hack Club stickers shipped to your door.",
      imageUrl:
        "https://cdn.hackclub.com/019d17df-28f0-71a2-8ba8-366a94dacb4e/pile_of_stickers.webp",
      price: 1,
    },
    {
      name: "Raspberry Pi Pico",
      description:
        "The RP2040-powered microcontroller. Perfect for Breadboard projects.",
      imageUrl:
        "https://cdn.hackclub.com/019d17df-ab61-7115-8c67-618edce19967/image.png",
      price: 6,
    },
  ];

  await Promise.all(shopItems.map((item) => db.insert(products).values(item)));
}

export async function addProduct(data: {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock?: number | null;
}) {
  const session = await requireSession();
  if (!(await isAdminSession(session)))
    throw new Error("Admin access required");
  await db.insert(products).values({
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl,
    price: data.price,
    stock:
      data.stock === null || data.stock === undefined
        ? null
        : Math.max(0, Math.floor(Number(data.stock) || 0)),
  });
  revalidatePath("/platform/shop");
  revalidatePath("/platform/admin/products");
}

export async function updateProduct(
  productId: number,
  data: {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number | null;
    active: boolean;
  },
) {
  const session = await requireSession();
  if (!(await isAdminSession(session)))
    throw new Error("Admin access required");
  await db
    .update(products)
    .set({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      price: Math.max(1, Math.floor(Number(data.price) || 1)),
      stock:
        data.stock === null
          ? null
          : Math.max(0, Math.floor(Number(data.stock) || 0)),
      active: data.active,
    })
    .where(eq(products.id, productId));
  revalidatePath("/platform/shop");
  revalidatePath("/platform/admin/products");
}

export async function deleteProduct(productId: number) {
  const session = await requireSession();
  if (!(await isAdminSession(session)))
    throw new Error("Admin access required");

  const existingOrderItems = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .where(eq(orderItems.productId, productId))
    .limit(1);

  if (existingOrderItems[0]) {
    await db
      .update(products)
      .set({ active: false })
      .where(eq(products.id, productId));
  } else {
    await db.delete(products).where(eq(products.id, productId));
  }

  revalidatePath("/platform/shop");
  revalidatePath("/platform/admin/products");
}

export async function toggleProduct(productId: number, active: boolean) {
  const session = await requireSession();
  if (!(await isAdminSession(session)))
    throw new Error("Admin access required");
  await db.update(products).set({ active }).where(eq(products.id, productId));
  revalidatePath("/platform/shop");
  revalidatePath("/platform/admin/products");
}
