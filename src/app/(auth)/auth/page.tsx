import { Login } from "@app/components/auth/login";
import { auth } from "@app/server/auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await auth();
  if (session) {
    return redirect("/");
  }

  return (
    <div className="py-4">
      <Login />
    </div>
  );
}
