"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface FileViewProps {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

export default function FileView({ owner, repo, branch, path, token }: FileViewProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const res = await fetch(apiUrl, {
        headers: { Authorization: `token ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.encoding === "base64") {
          const decodedContent = atob(data.content);
          setFileContent(decodedContent);
          setFileType(data.name.split(".").pop() || "txt");
        }
      } else {
        setFileContent(null);
      }
      setLoading(false);
    };

    fetchFile();
  }, [owner, repo, path, branch, token]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? <p>Loading file...</p> : fileContent === null ? <p>Failed to load file.</p> : (
        <SyntaxHighlighter language={fileType} style={dracula}>
          {fileContent}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
