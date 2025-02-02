"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { authUserAtom } from "@/state/atoms";
import GitHubLogin from "@/components/GitHubLogin";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [authUser] = useAtom(authUserAtom);
  const router = useRouter();

  const githubUsername = (authUser as any)?.reloadUserInfo?.screenName || null;

  // Redirect when authenticated
  useEffect(() => {
    if (authUser && githubUsername) {
      router.replace(`/${githubUsername}`);
    }
  }, [authUser, githubUsername, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">GitHub OAuth with Firebase</h1>

      {authUser ? (
        <div className="flex flex-col items-center">
          <p>Signed in as <strong>{githubUsername || authUser.email}</strong></p>
          <p>Email: <strong>{authUser.email || "No email provided"}</strong></p>
          <button
            onClick={() => signOut(auth)}
            className="px-4 py-2 mt-4 bg-red-500 text-white rounded-lg"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <GitHubLogin />
      )}
    </div>
  );
}
