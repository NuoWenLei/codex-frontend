 /* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { authUserAtom } from "@/state/atoms";

interface FileItem {
  name: string;
  path: string;
  type: "file" | "dir";
}

interface FolderViewProps {
  owner: string;
  repo: string;
  branch: string;
  path?: string;
  token: string;
}

export default function FolderView({
  owner,
  repo,
  branch,
  path = "",
  token,
}: FolderViewProps) {
  const [contents, setContents] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const authUser = useAtomValue(authUserAtom);

  const githubUsername = (authUser as any)?.reloadUserInfo?.screenName || null;

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      const apiUrl = `http://54.90.74.38/api/github/${owner}/${repo}/${githubUsername}/${branch}/content/${path}`;
      console.log("apiurl: ", apiUrl)
      const res = await fetch(apiUrl);

      if (res.ok) {
        const data = await res.json();
        setContents(data);
      } else {
        setContents([]);
      }
      setLoading(false);
    };

    fetchContents();
  }, [owner, repo, path, branch, token]);

  // Determine where ".." should link to
  const parentPath = path.split("/").slice(0, -1).join("/");
  console.log("parentPath, ", parentPath);
  const backtrackHref = parentPath
    ? `/repo/${owner}/${repo}/tree/${branch}/${parentPath}` // Normal backtracking
    : `/repo/${owner}/${repo}`; // Go to repo root when at branch root

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <p>Loading...</p>
      ) : contents.length === 0 ? (
        <p className="text-gray-500">This folder is empty.</p>
      ) : (
        <div className="border border-gray-300 rounded-lg bg-white">
          {/* Backtracking (.. button) */}
          {path.length > 0 && (
            <div className="flex items-center px-4 py-2 hover:bg-gray-100 border-b border-gray-200 rounded-lg">
              <span className="mr-2 text-gray-500">🔼</span>
              <Link
                href={backtrackHref}
                className="text-blue-600 hover:underline text-lg"
              >
                ..
              </Link>
            </div>
          )}

          {/* File & Folder Listing */}
          {contents.map((item) => (
            <div
              key={item.path}
              className="flex items-center px-4 py-2 hover:bg-gray-100 border-b border-gray-200 rounded-lg"
            >
              {item.type === "dir" ? (
                <span className="mr-2 text-blue-500">📁</span>
              ) : (
                <span className="mr-2 text-gray-500">📄</span>
              )}
              <Link
                href={
                  item.type === "dir"
                    ? `/repo/${owner}/${repo}/tree/${branch}/${item.path}`
                    : `/repo/${owner}/${repo}/blob/${branch}/${item.path}`
                }
                className="text-blue-600 hover:underline"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
