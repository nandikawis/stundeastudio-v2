"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      console.log("DEBUG email submitted:", email);
      // example: await sendResetPasswordEmail(email);
      router.push("/login/verifforgot");
    } catch (error) {
      console.error("DEBUG error submitting email:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-6">
      <div className="w-full bg-white rounded-lg shadow-md h-full p-6">
        <div className="flex justify-center mb-8">
          <img
            src="/logobesar.png"
            alt="Kami Property Logo"
            width={180}
            height={60}
          />
        </div>

        <h2 className="text-center text-2xl font-semibold mb-8 text-black">
          Forgot Password ?
        </h2>

        <div className="space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-black placeholder-gray-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-colors"
          >
            Send Reset Link
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-600">Have an account? </span>
            <Link href="/login" className="text-accent-dark hover:text-accent hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
