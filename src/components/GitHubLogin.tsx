"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider } from "@/lib/firebase";

export default function GitHubLogin() {
  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      console.log("Logged in as:", user);
    } catch (error) {
      console.error("GitHub Login Error:", error);
    }
  };

  return (
    <button
      onClick={signInWithGitHub}
      className="px-4 py-2 bg-gray-900 text-white rounded-lg"
    >
      Sign in with GitHub
    </button>
  );
}
