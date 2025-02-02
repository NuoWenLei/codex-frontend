import FileView from "@/components/FileView";

export default async function RepoBlobPage({ params }: { params: { owner: string; repo: string; branch: string; path?: string[] } }) {
  const {owner, repo, branch, path} = await params;
  const blobPath = path?.join("/") || "";
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN!; // Store token in env variable

  return <FileView owner={owner} repo={repo} branch={branch} path={blobPath} token={token} />;
}
