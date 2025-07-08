import { useEffect, useState } from 'react';
import Spinner from '../Spinner.jsx';
import { useCreateService } from '../../hooks/useProjects.js';

export default function ServiceCreateStep({ projectId, name, repo, branch, onSuccess, onError }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const createServiceMutation = useCreateService();

  useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');
      createServiceMutation.mutate({
        projectId,
        name,
        repo,
        branch,
      }, {
        onSuccess: (data) => {
          setStatus('success');
          const id = data?.serviceCreate?.id;
          if (!id) {
            setError('Service creation failed: No service ID returned');
            onError && onError('Service creation failed: No service ID returned');
            return;
          }
          onSuccess(id);
        },
        onError: (err) => {
          setStatus('error');
          setError(err.message || 'Service creation failed');
          onError && onError(err.message || 'Service creation failed');
        },
      });
    }
  }, [status, projectId, name, repo, branch, onSuccess, onError, createServiceMutation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {status === 'loading' && (
        <>
          <Spinner />
          <div className="mt-2 text-gray-600">Creating your service...</div>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="text-red-500 mb-2">{error}</div>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              setError(null);
              setStatus('idle');
              createServiceMutation.reset();
            }}
          >
            Retry
          </button>
        </>
      )}
      {status === 'success' && (
        <div className="text-green-600">Service created successfully!</div>
      )}
    </div>
  );
} 
