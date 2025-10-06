"use client";

import { BOT_IMAGE_SRC } from "@/app/constants";

import { BiLogoGoogle } from "react-icons/bi";

import { signIn } from "next-auth/react";

import Image from "next/image";

export default function Login() {
  return (
    <div className="p-5 h-[calc(100vh-4rem)] flex flex-col items-center ">
      <div className="flex flex-col items-center w-full 2xl:w-1/3 gap-5">
        {/* 

      <div className="h-100 w-70 mt-10 bg-amber-600">
        <button
          className="bg-blue-600 h-10 w-20 hover:cursor-pointer"
          onClick={() => signIn("google")}
        >
          Google Auth
        </button>
      </div> */}

        <Image src={BOT_IMAGE_SRC} alt="AP Bot" height={250} width={350} />

        <p className="text-3xl text-center">Log in to chat with AP Bot!</p>

        <button
          onClick={() => signIn("google")}
          className="h-10 w-fit p-5 gap-2 rounded-3xl border-4 border-amber-500 flex justify-between items-center hover:cursor-pointer"
        >
          <BiLogoGoogle size={20} /> <p>Sign in with Google</p>
        </button>
      </div>
    </div>
  );
}
