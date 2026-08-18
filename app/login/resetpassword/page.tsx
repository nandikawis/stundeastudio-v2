import { redirect } from "next/navigation";

/** Legacy path — reset now lands on /login/verifforgot from the email link. */
export default function ResetPasswordRedirectPage() {
  redirect("/login/forgotpassword");
}
