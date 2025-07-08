import { useEffect, useState } from 'react';
import Spinner from '../Spinner.jsx';
import { useDeployService } from '../../hooks/useProjects.js';

export default function ServiceDeployStep({ serviceId, environmentId, onSuccess, onError }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const deployServiceMutation = useDeployService();

  useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');
      deployServiceMutation.mutate({
        serviceId,
        environmentId,
      }, {
        onSuccess: () => {
          setStatus('success');
          onSuccess();
        },
        onError: (err) => {
          setStatus('error');
          setError(err.message || 'Service deploy failed');
          onError && onError(err.message || 'Service deploy failed');
        },
      });
    }
  }, [status, serviceId, environmentId, onSuccess, onError, deployServiceMutation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {status === 'loading' && (
        <>
          <Spinner />
          <div className="mt-2 text-gray-600">Deploying your service...</div>
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
              deployServiceMutation.reset();
            }}
          >
            Retry
          </button>
        </>
      )}
      {status === 'success' && (
        <div className="text-green-600">Service deployed successfully!</div>
      )}
    </div>
  );
} 
