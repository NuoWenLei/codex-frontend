/* eslint-disable */
"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import { authUserAtom, selectedBranchAtom } from "@/state/atoms";

export default function RepoLayout({ children }: { children: ReactNode }) {
  const params = useParams(); // Get dynamic route params
  const searchParams = useSearchParams();
  const router = useRouter();

  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useAtom(selectedBranchAtom);

  const authUser = useAtomValue(authUserAtom);

  const githubUsername = (authUser as any)?.reloadUserInfo?.screenName || null;

  useEffect(() => {
    const fetchBranches = async () => {
      if (!params.owner || !params.repo) return;

      const apiUrl = `/repos/${params.owner}/${params.repo}/${githubUsername}/branches`;
      console.log("apiurl: ", apiUrl);
      const res = await fetch(`/api/intercepted`, {
        method: "POST",
        body: JSON.stringify({
          backend_path: apiUrl,
          method: "GET",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const branchNames = data.map((branch: any) => branch.name);
        setBranches(branchNames);
      } else {
        console.error("Failed to fetch branches");
      }
    };

    fetchBranches();
  }, [params, searchParams]);

  // Handle branch change
  const handleBranchChange = (newBranch: string) => {
    setSelectedBranch(newBranch);
    // Update URL without refreshing
    router.push(`/repo/${params.owner}/${params.repo}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Repo Header with Branch Selector */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          <Link href={`/repo/${params.owner}/${params.repo}`} className="text-blue-300 hover:underline">
            {params.repo}
          </Link>
        </h1>

        {/* Branch Selection Dropdown */}
        <div>
          <label className="text-sm font-semibold mr-2">Branch:</label>
          <select
            className="border rounded px-2 py-1 text-black"
            value={selectedBranch}
            onChange={(e) => handleBranchChange(e.target.value)}
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Page Content */}
      {children}
    </div>
  );
}
