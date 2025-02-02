 /* eslint-disable */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import FolderView from "@/components/FolderView";
import Breadcrumb from "@/components/Breadcrumb";
import { useAtom } from "jotai"
import { selectedBranchAtom } from "@/state/atoms";


export default function RepoTreePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedBranch] = useAtom(selectedBranchAtom);

  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN!;

  // Normalize `params.path` so it's always an array
  const pathArray =
    typeof params.path === "string" ? [params.path] : params.path || [];
  const path = pathArray.join("/");

  // Redirect to repo root if no path is provided

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Breadcrumb
        owner={params.owner as string}
        repo={params.repo as string}
        branch={selectedBranch}
        path={pathArray}
      />

      <FolderView
        owner={params.owner as string}
        repo={params.repo as string}
        branch={selectedBranch}
        path={path}
        token={token}
      />
    </div>
  );

}
