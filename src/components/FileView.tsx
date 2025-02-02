/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useAtomValue } from "jotai";
import { authUserAtom } from "@/state/atoms";

interface FileViewProps {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

export default function FileView({
  owner,
  repo,
  branch,
  path,
  token,
}: FileViewProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const authUser = useAtomValue(authUserAtom);

  const githubUsername = (authUser as any)?.reloadUserInfo?.screenName || null;

  console.log(`args: ${owner}, ${repo}, ${branch}, ${path}, ${token}`);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      const apiUrl = `/github/${owner}/${repo}/${githubUsername}/${branch}/content/${path}`;
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
        if (data.encoding === "base64") {
          const decodedContent = decodeURIComponent(escape(atob(data.content)));
          setFileContent(decodedContent);
          setFileType(data.name.split(".").pop() || "txt");
        }
        // console.log("data decoded");
      } else {
        setFileContent(null);
      }
      setLoading(false);
    };

    fetchFile();
  }, [owner, repo, path, branch, token]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <p>Loading file...</p>
      ) : fileContent === null ? (
        <p>Failed to load file.</p>
      ) : fileType === "md" ? (
        <div className="markdown-body !bg-[transparent]">
          <ReactMarkdown>{fileContent}</ReactMarkdown>
        </div>
      ) : (
        <SyntaxHighlighter language={fileType ?? undefined} style={dracula}>
          {fileContent}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
