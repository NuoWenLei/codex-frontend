import { atom } from "jotai";
import { User } from "firebase/auth";

export const authUserAtom = atom<User | null>(null);
export const isNewUserAtom = atom<boolean | null>(null); // ✅ Set `null` initially for proper checks
export const githubUsernameAtom = atom<string | null>(null); // ✅ Store username separately
export const patAtom = atom<string | null>(null);

// Global atom for the selected branch
export const selectedBranchAtom = atom("main");
