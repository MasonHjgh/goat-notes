import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";
import LogOutButton from "@/components/LogOutButton";
import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./sidebar";

async function Header() {
  const user= await getUser();
  return ( 
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <SidebarTrigger className="abssolute left-1 top-1"/>
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/goatius.png"
          alt="logo"
          width={60}
          height={60}
          priority
          className="rounded-full"
        />
        <h1 className="flex flex-col pb-1 text-2xl leading-6 font-semibold">
          GOAT <span className="">Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? <LogOutButton />:<>
        <Button asChild className="hidden sm:block">
          <Link href="/sign-up" >Sign up</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Login</Link>
        </Button>
        </>}
        <DarkModeToggle />
      </div>


    </header>
  );
}

export default Header;
