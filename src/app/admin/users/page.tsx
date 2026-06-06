import { redirect } from "next/navigation";

export default function AdminUsersRedirectPage() {
  redirect("/platform/admin/users");
}
