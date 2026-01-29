"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPortal } from "react-dom";
import { setAccessToken } from "../lib/api";

type LoginFormData = {
  email: string;
  password: string;
};

type SignupFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  retryPassword: string;
  termsAccepted: boolean;
  countryCode: string;
};

const countries = [
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
];

type Regislogin = {
  login: boolean;
  signup: boolean;
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes checkmark {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    60% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes drawCheck {
    0% {
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  body.__noscroll {
    overflow: hidden !important;
    touch-action: none !important;
    overscroll-behavior: none !important;
    position: fixed;
    width: 100vw;
  }
`;

const darkGold = "var(--accent-dark)";
const darkGoldHover = "var(--accent)";
const textDarkGold = "var(--accent-dark)";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailLogin, setShowFailLogin] = useState(false);
  const [regislogin, setRegislogin] = useState<Regislogin>({
    login: true,
    signup: false,
  });
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    retryPassword: "",
    termsAccepted: false,
    countryCode: "+62",
  });

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Prevent scrolling on body when login/signup is mounted
  useEffect(() => {
    document.body.classList.add("__noscroll");
    return () => {
      document.body.classList.remove("__noscroll");
    };
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleLogin = async (values: typeof loginFormData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const loginData = await response.json();

      if (response.status === 401) {
        setShowFailLogin(true);
        return;
      }

      if (!response.ok) {
        setShowFailLogin(true);
        return;
      }

      if (loginData.success) {
        const token = loginData.data?.session?.access_token;
        setAccessToken(token ?? null);
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }
      setShowFailLogin(true);
    }
  };

  const handleSignup = async (
    values: typeof formData,
  ) => {
    try { 
      const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            email: values.email,
            full_name: values.name,
            phone: `${values.countryCode}${values.phoneNumber}`,
            address: values.address,
            password: values.password,
          }
        ),
      });

      const signupData = await signupResponse.json();
      if (!signupData.success) {
        throw new Error(signupData.message);
      }

      if (signupData.success) {
        router.push(`/login/verifsignup/${formData.email}`);
      } else {
        alert(signupData.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const modalContent = showSuccessModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] animate-[fadeIn_0.3s_ease-in-out]">
      <div 
        className="fixed bg-white p-12 rounded-lg shadow-xl transform animate-[fadeIn_0.5s_ease-out] w-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ 
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          zIndex: 99999
        }}
      >
        <div className="text-center">
          <div className="mb-6 relative">
            <div 
              className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center"
              style={{ 
                filter: 'none',
                imageRendering: 'crisp-edges'
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-14 h-14" 
                style={{
                  shapeRendering: 'crispEdges',
                  transform: 'scale(1.5)'
                }}
              >
                <path 
                  d="M5 13l4 4L19 7" 
                  fill="none" 
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 100,
                    strokeDashoffset: 100,
                    animation: 'drawCheck 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards'
                  }}
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-[slideUp_0.8s_ease-out]">
            Login Successful!
          </h2>
          <p className="text-gray-600 text-lg animate-[slideUp_0.8s_ease-out_0.2s]">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  );

  const modalContentFailLogin = showFailLogin && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] animate-[fadeIn_0.3s_ease-in-out]">
      <div className="fixed bg-white p-12 border border-red-500 rounded-lg shadow-xl transform animate-[fadeIn_0.5s_ease-out] w-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={() => setShowFailLogin(false)}
          className="absolute top-4 right-4 text-red-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-[slideUp_0.8s_ease-out]">Login Failed!</h2>
        <p className="text-gray-600 text-lg animate-[slideUp_0.8s_ease-out_0.2s]">Please check your email and password.</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-center h-screen p-6 overflow-hidden">
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

          <h2 className="text-center text-2xl font-semibold mb-8 text-black">
            {regislogin.login ? "Hello, Welcome" : "Create Your Account"}
          </h2>

          {/* Toggle Login/Signup */}
          <div className="flex justify-center mb-8">
            <div className="relative flex items-center">
              <div className="w-[200px] h-[40px] bg-gray-200 rounded-full p-1 flex items-center">
                <div
                  className={`absolute w-[90px] h-[32px]`}
                  style={{
                    background: regislogin.login || regislogin.signup ? darkGold : "",
                    left: regislogin.login ? "0.25rem" : "6.63rem",
                    borderRadius: "9999px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setRegislogin({ login: true, signup: false })}
                  className={`z-10 flex-1 px-6 py-1.5 rounded-full transition-colors ${
                    regislogin.login ? "text-white" : "text-gray-800"
                  }`}
                  style={{
                    color: regislogin.login ? "#fff" : textDarkGold
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setRegislogin({ login: false, signup: true })}
                  className={`z-10 flex-1 px-6 py-1.5 rounded-full transition-colors ${
                    regislogin.signup ? "text-white" : "text-gray-800"
                  }`}
                  style={{
                    color: regislogin.signup ? "#fff" : textDarkGold
                  }}
                >
                  Signup
                </button>
              </div>
            </div>
          </div>

          {/* Forms */}
          <div className="relative">
            <div
              className={`absolute w-full transition-all duration-300 ease-in-out ${
                regislogin.login
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-full"
              }`}
            >
              {regislogin.login && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={loginFormData.email}
                        onChange={(e) =>
                          setLoginFormData({ ...loginFormData, email: e.target.value })
                        }
                        placeholder="Email"
                        className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                        style={{
                          boxShadow: "none",
                          borderColor: "var(--accent)",
                          outline: "none"
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={loginFormData.password}
                        onChange={(e) =>
                          setLoginFormData({ ...loginFormData, password: e.target.value })
                        }
                        placeholder="Password"
                        className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                        style={{
                          boxShadow: "none",
                          borderColor: "var(--accent)",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLogin(loginFormData)}
                    className="w-full text-white py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                    style={{
                      background: darkGold,
                      color: "#fff",
                      border: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => { (e.target as HTMLElement).style.background = darkGoldHover; }}
                    onMouseOut={e => { (e.target as HTMLElement).style.background = darkGold; }}
                    onFocus={e => { (e.target as HTMLElement).style.background = darkGoldHover; }}
                    onBlur={e => { (e.target as HTMLElement).style.background = darkGold; }}
                  >
                    Login
                  </button>

                  <div className="text-center">
                    <Link
                      href="/login/forgotpassword"
                      className="text-sm text-accent-dark hover:text-accent transition-colors"
                      style={{
                        color: darkGold,
                        transition: "color 0.15s"
                      }}
                      onMouseOver={e => { (e.target as HTMLElement).style.color = darkGoldHover; }}
                      onMouseOut={e => { (e.target as HTMLElement).style.color = darkGold; }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`absolute w-full transition-all duration-300 ease-in-out ${
                regislogin.signup
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-full"
              }`}
            >
              {regislogin.signup && (
                <div className="space-y-3 max-w-md h-full mx-auto">
                  <div className="space-y-3 max-w-md h-full mx-auto">
                    <h3 className="text-black text-sm font-medium">
                      Create an Account
                    </h3>

                    <div >
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Full Name"
                        className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                        style={{
                          boxShadow: "none",
                          borderColor: "var(--accent)",
                          outline: "none"
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Email"
                        className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                        style={{
                          boxShadow: "none",
                          borderColor: "var(--accent)",
                          outline: "none"
                        }}
                      />
                      <div className="relative flex">
                        <select
                          value={formData.countryCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              countryCode: e.target.value,
                            })
                          }
                          className="absolute left-0 w-[5rem] h-full p-2.5 text-sm bg-white border border-r-0 border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 text-black appearance-none cursor-pointer"
                          style={{
                            borderColor: "var(--accent)",
                            outline: "none",
                            color: textDarkGold
                          }}
                        >
                          {countries.map((country) => (
                            <option
                              key={country.code}
                              value={country.code}
                              className="bg-white"
                            >
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="Phone Number"
                          className="w-full pl-[5.2rem] p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                          style={{
                            boxShadow: "none",
                            borderColor: "var(--accent)",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Address"
                      className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                      style={{
                        boxShadow: "none",
                        borderColor: "var(--accent)",
                        outline: "none"
                      }}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Strong Password"
                        className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                        style={{
                          boxShadow: "none",
                          borderColor: "var(--accent)",
                          outline: "none"
                        }}
                      />
                      <input
                        type="password"
                        value={formData.retryPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            retryPassword: e.target.value,
                          })
                        }
                        placeholder="Retry Password"
                        className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 text-black placeholder-gray-500"
                        style={{
                          boxShadow: "none",
                          borderColor: "var(--accent)",
                          outline: "none"
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            termsAccepted: e.target.checked,
                          })
                        }
                        className="w-4 h-4 bg-white border-gray-200 rounded focus:ring-0 focus:ring-offset-0"
                        style={{
                          accentColor: darkGold,
                          color: darkGold
                        }}
                      />
                      <span className="text-sm text-gray-600">
                        I have read and agree to the{" "}
                        <button
                          onClick={() => {
                            alert(
                              "Terms of Service: This is a sample terms of service agreement that outlines the rules and regulations for using our platform."
                            );
                          }}
                          className="text-sm text-accent-dark hover:text-accent transition-colors"
                          style={{
                            color: darkGold,
                            transition: "color 0.15s"
                          }}
                          onMouseOver={e => { (e.target as HTMLElement).style.color = darkGoldHover; }}
                          onMouseOut={e => { (e.target as HTMLElement).style.color = darkGold; }}
                        >
                          Terms of Service
                        </button>
                      </span>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.termsAccepted) {
                            alert("Please accept the Terms of Service");
                            return;
                          }
                          if (formData.password !== formData.retryPassword) {
                            alert("Passwords do not match");
                            return;
                          }
                          handleSignup(formData);
                        }}
                        className="w-[300px] text-white py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                        style={{
                          background: darkGold,
                          color: "#fff",
                          border: "none",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={e => { (e.target as HTMLElement).style.background = darkGoldHover; }}
                        onMouseOut={e => { (e.target as HTMLElement).style.background = darkGold; }}
                        onFocus={e => { (e.target as HTMLElement).style.background = darkGoldHover; }}
                        onBlur={e => { (e.target as HTMLElement).style.background = darkGold; }}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {mounted && modalContent && createPortal(
        modalContent,
        document.body
      )}
      {mounted && modalContentFailLogin && createPortal(
        modalContentFailLogin,
        document.body
      )}
    </>
  );
}
