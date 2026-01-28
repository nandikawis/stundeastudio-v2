"use client";

import React, { useState, useRef } from "react";

export default function VerifForgotPage(): React.JSX.Element {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("DEBUG verification code submitted:", code.join(""));
    // Add logic to verify the code
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

        <h2 className="text-center text-2xl font-semibold mb-4 text-black">
          Verification Code for "Forgot Password"
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please enter the received code. We sent it to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-72 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </div>

          <div className="text-center mt-4">
            <a href="#" className="text-accent-dark hover:text-accent hover:underline">
              Didn't receive a code?
            </a>
            <p className="text-gray-600 mt-2">
              Get new code in <span className="font-bold">00:56</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
