"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function VerifSignupPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const theemail = decodeURIComponent(Array.isArray(params?.email) ? params.email[0] : params?.email ?? '').replace("%40", "@");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState<number>(120); // 2 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const resendVerificationEmail = async () => {
    try {
      console.log("DEBUG theemail:", theemail);
      await fetch(`${API_URL}/api/auth/send-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: theemail }),
      });
      setIsResendDisabled(true);
      setCountdown(120);
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };

  const handleSubmit = async (verificationCode: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: theemail, token: verificationCode }),
      });

      if (response.ok) {
        console.log("Verification successful!");
        const data = await response.json();
        console.log("Response data:", data);
        setShowSuccessModal(true);
      } else {
        console.error("Verification failed:", await response.text());
      }
    } catch (error) {
      console.error("Error verifying signup:", error);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Backspace" && index > 0) {
      const newCode = [...code];
      newCode[index] = ""; // clear current input
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const modalContent = showSuccessModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] animate-[fadeIn_0.3s_ease-in-out]">
          <div 
            className="fixed bg-white p-8 rounded-lg shadow-lg max-w-md w-full animate-scaleIn"
            style={{ 
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              zIndex: 99999
            }}
          >
            <h3 className="text-2xl font-semibold text-center text-black mb-4">
              Congratulations!
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Your registration has been successfully completed.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
  )
  
  return (
    <>
    <div className="flex items-center justify-center h-screen p-6">
      <div className="w-full bg-white rounded-lg shadow-md h-full p-6">
      <div 
            className="flex justify-center w-[250px] mx-auto mb-20 mt-16 py-6"
            style={{
              backgroundImage: "url('/11.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
          </div>

        <h2 className="text-center text-2xl font-semibold mb-4 text-black">
          Verification Code for "Sign Up"
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please enter the received code. We sent it to your email.
        </p>

        <form className="space-y-4">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-10 h-10 text-center border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const verificationCode = code.join('');
                handleSubmit(verificationCode);
              }}
              className="w-72 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </div>

          <div className="text-center mt-4">
            {isResendDisabled ? (
              <>
                <span className="text-gray-600">
                  Get new code in{" "}
                  <span className="font-bold">
                    {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                    {String(countdown % 60).padStart(2, "0")}
                  </span>
                </span>
              </>
            ) : (
              <button
                onClick={resendVerificationEmail}
                className="text-accent-dark hover:text-accent hover:underline"
              >
                Resend verification code
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    {mounted && modalContent && createPortal(
      modalContent,
      document.body
    )}
  </>
  );
}
