import FolderView from "@/components/FolderView";

export default async function RepoTreePage({ params }: { params: { owner: string; repo: string; branch: string; path?: string[] } }) {
  const { owner, repo, branch, path } = await params;
  const folderPath = path?.join("/") || "";
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN!; // Store token in env variable

  return <FolderView owner={owner} repo={repo} branch={branch} path={folderPath} token={token} />;
}
