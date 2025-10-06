"use client";

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
      <p className="text-7xl">Log in</p>

      <div className="h-100 w-70 mt-10 bg-amber-600">
        <button
          className="bg-blue-600 h-10 w-20 hover:cursor-pointer"
          onClick={() => signIn("google")}
        >
          Google Auth
        </button>
      </div>
    </div>
  );
}
