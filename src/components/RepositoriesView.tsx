'use client';

import Link from 'next/link';
import React from 'react'

interface RepositoryItem {
    name: string,
    id: number,
}

interface RepositoriesViewProps {
    owner: string,
    token: string,
}

function RepositoriesView({ owner, token } : RepositoriesViewProps) {

    const [repositories, setRepositories] = React.useState<RepositoryItem[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchRepositories = async () => {
            setLoading(true);
            const apiUrl = `https://api.github.com/users/${owner}/repos`;
            const res = await fetch(apiUrl, {
                headers: { Authorization: `token ${token}` },
            });
            
            if (res.ok) {
                const data = await res.json();
                const repositoryItems: RepositoryItem[] = [];
                
                // Iterate through the list of repositories
                data.forEach((repoObj) => {
                    console.log(repoObj);
                    const newRepoItem: RepositoryItem = {
                        name: repoObj.name,
                        id: repoObj.id
                    };
                    repositoryItems.push(newRepoItem);
                });
                setRepositories(repositoryItems);
            } else {
                setRepositories([]);
            }
            setLoading(false);
        };

        fetchRepositories();
    }, [owner, token]);

  return (
    <div className='max-w-4xl mx-auto p-4'>
        {loading ? <p>Loading repositories...</p> : repositories.length === 0 ? <p>Failed to load repositories.</p> : (
            <div className='border border-gray-300 rounded-lg bg-white'>
                {repositories.map((repo) => (
                    <div key={repo.id} className="flex items-center border-b border-gray-300 p-2">
                        <span className="mr-2 text-blue-500">📁</span>
                        <Link href={`/repo/${owner}/${repo.name}/tree/main`} className="text-blue-600 hover:underline">
                            {repo.name}
                        </Link>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default RepositoriesView;