"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { authUserAtom } from "@/state/atoms";
import GitHubLogin from "@/components/GitHubLogin";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import PatModal from "@/components/PatModal";

export default function Home() {
  const authUser = useAtomValue(authUserAtom);
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  const githubUsername = (authUser as any)?.reloadUserInfo?.screenName || null;


  const checkIfUserExists = async (username: string) => {
    console.log("Checking if user exists for:", username);
    try {
      const response = await fetch(`http://54.90.74.38/api/exists/user/${username}`);
      const data = await response.json();
      console.log("API Response:", data);
      return data.result === "exists";
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false; // Assume existing user on error to avoid blocking login
    }
  };

  useEffect(() => {
    if (!authUser || !githubUsername || isNewUser !== null) return; // ✅ Avoid re-fetching

    const fetchUserStatus = async () => {
      const userExists = await checkIfUserExists(githubUsername);
      setIsNewUser(!userExists);
      console.log("User existence checked. isNewUser set to:", !userExists);
    };

    fetchUserStatus();
  }, [authUser, githubUsername, isNewUser]);

  useEffect(() => {
    if (isNewUser === false && authUser && githubUsername) {
      console.log("Redirecting to:", `/${githubUsername}`);
      router.replace(`/${githubUsername}`);
    }
  }, [isNewUser, authUser, githubUsername, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">GitHub OAuth with Firebase</h1>

      {authUser ? (
        <>
          {isNewUser === null ? (
            <p>Checking user status...</p> // ✅ Show loading state while checking
          ) : isNewUser ? (
            <>
              <p>Welcome! First-time login detected.</p>
              <PatModal username={githubUsername} /> // ✅ Show modal if first-time login
            </>
          ) : (
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
          )}
        </>
      ) : (
        <GitHubLogin />
      )}
    </div>
  );
}
