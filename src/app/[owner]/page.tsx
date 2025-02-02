import RepositoriesView from "@/components/RepositoriesView";

export default async function RepoListPage({ params }: { params: { owner: string } }) {
    const { owner } = await params;
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN!; // Store token in env variable

    return <RepositoriesView owner={owner} token={token}/>;
}