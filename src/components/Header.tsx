"use client";

import Link from "next/link";
import React from "react";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { BOT_IMAGE_SRC } from "@/app/constants";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky h-16 w-full p-5 bg-amber-400 flex justify-between items-center">
      <Link href={"/bot"}>
        <Image src={BOT_IMAGE_SRC} alt="AP Bot" height={50} width={50} />
      </Link>

      {!!session && (
        <button
          className="h-8 w-fit px-5 py-1 rounded-md bg-black text-white hover:cursor-pointer"
          title="Logout"
          onClick={() => signOut()}
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
