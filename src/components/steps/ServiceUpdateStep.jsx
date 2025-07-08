import { useEffect, useState } from 'react';
import Spinner from '../Spinner.jsx';
import { useUpdateService } from '../../hooks/useProjects.js';

export default function ServiceUpdateStep({ environmentId, serviceId, buildCommand, startCommand, onSuccess, onError }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const updateServiceMutation = useUpdateService();

  useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');
      updateServiceMutation.mutate({
        environmentId,
        serviceId,
        buildCommand,
        startCommand,
      }, {
        onSuccess: () => {
          setStatus('success');
          onSuccess();
        },
        onError: (err) => {
          setStatus('error');
          setError(err.message || 'Service update failed');
          onError && onError(err.message || 'Service update failed');
        },
      });
    }
  }, [status, environmentId, serviceId, buildCommand, startCommand, onSuccess, onError, updateServiceMutation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {status === 'loading' && (
        <>
          <Spinner />
          <div className="mt-2 text-gray-600">Updating your service...</div>
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
              updateServiceMutation.reset();
            }}
          >
            Retry
          </button>
        </>
      )}
      {status === 'success' && (
        <div className="text-green-600">Service updated successfully!</div>
      )}
    </div>
  );
} 
