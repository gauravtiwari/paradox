import { useState } from 'react';
import { useCreateProject } from '../../hooks/useProjects.js';
import Spinner from '../Spinner.jsx';

export default function ProjectCreateStep({ onSuccess, onError }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [buildCommand, setBuildCommand] = useState('');
  const [startCommand, setStartCommand] = useState('');
  const [port, setPort] = useState(3000);
  const [isLoading, setIsLoading] = useState(false);

  const createProjectMutation = useCreateProject();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let repoName = repo;
      const urlMatch = repo.match(/github\.com\/([^\/]+\/[^\/]+)/);
      if (urlMatch) {
        repoName = urlMatch[1];
      }
      repoName = repoName.trim();
      const result = await createProjectMutation.mutateAsync({
        name,
        description,
        repo: repoName,
        branch
      });

      const environmentId = result.projectCreate?.environments?.edges?.[0]?.node?.id;
      
      if (!environmentId) {
        throw new Error('No environment created with project');
      }

      onSuccess(
        result.projectCreate.id,
        environmentId,
        name,
        repo,
        branch,
        buildCommand,
        startCommand,
        port
      );
    } catch (error) {
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="my-awesome-project"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Project description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repository URL
          </label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tinyplex/vite-tinybase"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch
          </label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="main"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Port
          </label>
          <input
            type="number"
            value={port}
            min={1}
            max={65535}
            onChange={(e) => setPort(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Build Command (optional)
          </label>
          <input
            type="text"
            value={buildCommand}
            onChange={(e) => setBuildCommand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="npm run build"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Command (optional)
          </label>
          <input
            type="text"
            value={startCommand}
            onChange={(e) => setStartCommand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="npm start"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" />
              Creating Project...
            </>
          ) : (
            'Create Project'
          )}
        </button>
      </form>
    </div>
  );
} 
