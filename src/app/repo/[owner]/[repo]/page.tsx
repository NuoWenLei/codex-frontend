"use client";

import { useParams, useSearchParams } from "next/navigation";
import FolderView from "@/components/FolderView";
import FileView from "@/components/FileView";
import { useAtom } from "jotai"
import { selectedBranchAtom } from "@/state/atoms";

export default function RepoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN!;
  
  // Get selected branch from URL (set by layout)
  const [selectedBranch] = useAtom(selectedBranchAtom);

  return (
    <div>
      {/* Folder Content */}
      <FolderView
        owner={params.owner as string}
        repo={params.repo as string}
        branch={selectedBranch}
        path={undefined}
        token={token}
      />

      {/* README File View */}
      <div className="pt-10">
        <div>README</div>
        <FileView
          owner={params.owner as string}
          repo={params.repo as string}
          branch={selectedBranch}
          path="README.md"
          token={token}
        />
      </div>
    </div>
  );
}
