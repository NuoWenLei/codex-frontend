import Link from "next/link";

export default function RepoPage({ params }: { params: { owner: string; repo: string } }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{params.repo}</h1>
      <div className="mt-4">
        <Link href={`/repo/${params.owner}/${params.repo}/tree/main`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">View Files</button>
        </Link>
      </div>
    </div>
  );
}
