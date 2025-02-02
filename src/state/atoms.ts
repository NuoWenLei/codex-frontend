import { atom } from "jotai";
import { User } from "firebase/auth";

export const authUserAtom = atom<User | null>(null);

// Global atom for the selected branch
export const selectedBranchAtom = atom("main");
