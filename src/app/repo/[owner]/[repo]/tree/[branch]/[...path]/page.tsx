import FolderView from "@/components/FolderView";

export default function RepoTreePage({ params }: { params: { owner: string; repo: string; branch: string; path?: string[] } }) {
  const path = params.path?.join("/") || "";
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN!; // Store token in env variable
  console.log("we got here")

  return <FolderView owner={params.owner} repo={params.repo} branch={params.branch} path={path} token={token} />;
}
