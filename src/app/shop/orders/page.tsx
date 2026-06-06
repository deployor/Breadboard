import { redirect } from "next/navigation";

export default function OrdersRedirectPage() {
  redirect("/platform/shop/orders");
}
