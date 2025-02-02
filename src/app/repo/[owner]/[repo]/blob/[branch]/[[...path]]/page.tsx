"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FileView from "@/components/FileView";
import { useAtom } from "jotai"
import { selectedBranchAtom } from "@/state/atoms";

export default function RepoBlobPage() {
  const params = useParams();
  const [selectedBranch] = useAtom(selectedBranchAtom);

  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN!;

  // Normalize `params.path` so it's always an array
  const pathArray =
    typeof params.path === "string" ? [params.path] : params.path || [];
  const path = pathArray.join("/");

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        owner={params.owner as string}
        repo={params.repo as string}
        branch={selectedBranch}
        path={pathArray}
      />

      {/* File Content */}
      <FileView
        owner={params.owner as string}
        repo={params.repo as string}
        branch={selectedBranch}
        path={path}
        token={token}
      />
    </div>
  );
}
