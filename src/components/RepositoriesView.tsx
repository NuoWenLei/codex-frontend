 /* eslint-disable */
"use client";

import { authUserAtom } from "@/state/atoms";
import { useAtomValue } from "jotai";
import Link from "next/link";
import React, { useState } from "react";

interface RepositoryItem {
  name: string;
  id: number;
}

interface RepositoriesViewProps {
  owner: string;
  token: string;
}

function RepositoriesView({ owner, token }: RepositoriesViewProps) {
  const [repositories, setRepositories] = useState<RepositoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmRepo, setConfirmRepo] = useState<string | null>(null);
  const [integratingRepo, setIntegratingRepo] = useState<string | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState<{ repo: string; success: boolean } | null>(null);

  const authUser = useAtomValue(authUserAtom);
  const githubUsername = (authUser as any)?.reloadUserInfo?.screenName || null;

  // ✅ Handle integration request
  const integrateWithCodex = async (repo: string) => {
    setIntegratingRepo(repo);
    const apiUrl = `http://54.90.74.38/api/github/${owner}/${repo}/${githubUsername}/initialize`;
    const res = await fetch(apiUrl, { method: "POST" });

    if (res.ok) {
      console.log(`Successfully integrated ${repo} with Codex`);
      setIntegrationStatus({ repo, success: true });
    } else {
      console.error("Failed to integrate with Codex");
      setIntegrationStatus({ repo, success: false });
    }

    setIntegratingRepo(null);
    setConfirmRepo(null); // ✅ Close confirmation modal

    // ✅ Auto-hide integration status after 3 seconds
    setTimeout(() => setIntegrationStatus(null), 3000);
  };

  // ✅ Fetch repositories
  React.useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true);
      const apiUrl = `http://54.90.74.38/api/users/${owner}/repos`;
      const res = await fetch(apiUrl);

      if (res.ok) {
        const data = await res.json();
        setRepositories(data.map((repo: any) => ({ name: repo.name, id: repo.id })));
      } else {
        setRepositories([]);
      }
      setLoading(false);
    };

    fetchRepositories();
  }, [owner, token]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Repositories</h2>

      {loading ? (
        <p className="text-gray-500">Loading repositories...</p>
      ) : repositories.length === 0 ? (
        <p className="text-gray-500">No repositories found.</p>
      ) : (
        <div className="border border-gray-300 rounded-lg bg-white divide-y divide-gray-200">
          {repositories.map((repo) => (
            <div key={repo.id} className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">📁</span>
                <Link href={`/repo/${owner}/${repo.name}`} className="text-blue-600 font-medium hover:underline">
                  {repo.name}
                </Link>
              </div>
              {/* ✅ GitHub-style Integration Button */}
              <button
                onClick={() => setConfirmRepo(repo.name)}
                className="px-3 py-1 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
              >
                Integrate with Codex
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      {confirmRepo && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Integration
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to integrate <strong>{confirmRepo}</strong> with Codex?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => integrateWithCodex(confirmRepo)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                disabled={integratingRepo === confirmRepo}
              >
                {integratingRepo === confirmRepo ? "Integrating..." : "Yes, Integrate"}
              </button>
              <button
                onClick={() => setConfirmRepo(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Integration Success/Failure Popup */}
      {integrationStatus && (
        <div className="fixed bottom-5 right-5 bg-white border border-gray-300 p-4 rounded-lg shadow-lg flex items-center space-x-3">
          {integrationStatus.success ? (
            <>
              <span className="text-green-600 font-semibold">✅ Success:</span>
              <span className="text-gray-900">"{integrationStatus.repo}" integrated with Codex.</span>
            </>
          ) : (
            <>
              <span className="text-red-600 font-semibold">❌ Failed:</span>
              <span className="text-gray-900">"{integrationStatus.repo}" could not be integrated.</span>
            </>
          )}
          <button
            onClick={() => setIntegrationStatus(null)}
            className="px-2 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default RepositoriesView;
