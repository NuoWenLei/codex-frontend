 /* eslint-disable */
"use client";

import { signInWithPopup } from "firebase/auth";
import { useAtom } from "jotai";
import { authUserAtom, githubUsernameAtom, isNewUserAtom } from "@/state/atoms";
import { auth, githubProvider } from "@/lib/firebase";

export default function GitHubLogin() {
  const [, setAuthUser] = useAtom(authUserAtom);

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const githubUsername = (user as any)?.reloadUserInfo?.screenName || null;

      console.log("User signed in:", user);
      console.log("GitHub Username:", githubUsername);

      // ✅ Check if user exists in MongoDB

      setAuthUser(user);

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
