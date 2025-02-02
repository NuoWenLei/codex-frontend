"use client";

import { auth } from "@/lib/firebase";
import { authUserAtom } from "@/state/atoms";
import { User, onAuthStateChanged } from "firebase/auth";
import { Provider, useAtom } from "jotai";
import { ReactNode, useEffect } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [, setAuthUser] = useAtom(authUserAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setAuthUser(user); // Update global state
    });
    return () => unsubscribe();
  }, [setAuthUser]);

  return <Provider>{children}</Provider>;
}
