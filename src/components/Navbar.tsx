"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { authUserAtom } from "@/state/atoms";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import GitHubLogin from "@/components/GitHubLogin";
import { useEffect } from "react";

export default function Navbar() {
  const [authUser] = useAtom(authUserAtom);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/"); // Redirect to home page after signing out
  };

  useEffect(() => {
    if (!authUser) {
      router.replace("/")
    }
  }, [authUser, router])

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-wide">
        Codex
      </Link>

      {/* Auth Button */}
      {authUser ? (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Sign Out
        </button>
      ) : (
        <GitHubLogin />
      )}
    </nav>
  );
}
