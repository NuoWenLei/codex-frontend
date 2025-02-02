 /* eslint-disable */
import RepositoriesView from "@/components/RepositoriesView";

export default async function RepoListPage({ params }: { params: { owner: string } }) {
    const { owner } = await params;

    return <RepositoriesView owner={owner} token={""}/>;
}
