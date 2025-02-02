 /* eslint-disable */
"use client"
import RepositoriesView from "@/components/RepositoriesView";

export default async function RepoListPage({ params }: { params: Promise<{ owner: string }> }) {
    const { owner } = await params;

    return <RepositoriesView owner={owner} token={""}/>;
}
