"use client"
import Link from "next/link";

interface BreadcrumbProps {
  owner: string;
  repo: string;
  branch: string;
  path?: string[];
}

export default function Breadcrumb({ owner, repo, branch, path = [] }: BreadcrumbProps) {
  const basePath = `/repo/${owner}/${repo}/tree/${branch}`;

  return (
    <nav className="text-sm text-gray-500 mb-4">
      <Link href={`/repo/${owner}/${repo}`} className="text-blue-600 hover:underline">
        {repo}
      </Link>

      {path.length > 0 &&
        path.map((segment, index) => {
          const currentPath = path.slice(0, index + 1).join("/");
          return (
            <span key={currentPath}>
              {" / "}
              <Link href={`${basePath}/${currentPath}`} className="text-blue-600 hover:underline">
                {segment}
              </Link>
            </span>
          );
        })}
    </nav>
  );
}
