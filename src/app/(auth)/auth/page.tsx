import { Login } from "@app/components/auth/login";
import { auth } from "@app/server/auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await auth();
  if (session) {
    return redirect("/");
  }

  return (
    <div className="form-control gap-6">
      <Login />
    </div>
  );
}
