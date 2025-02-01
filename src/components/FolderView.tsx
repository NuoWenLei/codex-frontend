"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function FolderView({ owner, repo, branch, path = "", token }: FolderViewProps) {
  const [contents, setContents] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
        headers: { Authorization: `token ${token}` },
      });

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <p>Loading...</p>
      ) : contents.length === 0 ? (
        <p className="text-gray-500">This folder is empty.</p>
      ) : (
        <div className="border border-gray-300 rounded-lg bg-white">
          {contents.map((item) => (
            <div key={item.path} className="flex items-center px-4 py-2 hover:bg-gray-100 border-b border-gray-200">
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
