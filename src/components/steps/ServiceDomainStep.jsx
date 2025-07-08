import { useState, useEffect } from 'react';
import Spinner from '../Spinner.jsx';
import { api } from '../../api/queries.js';

export default function ServiceDomainStep({ environmentId, serviceId, port = 3000, onSuccess, onError }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');
      api.serviceDomainCreate({ environmentId, serviceId, targetPort: port })
        .then(() => {
          setStatus('success');
          onSuccess();
        })
        .catch((err) => {
          setStatus('error');
          setError(err.message || 'Service domain creation failed');
          onError && onError(err.message || 'Service domain creation failed');
        });
    }
  }, [status, environmentId, serviceId, port, onSuccess, onError]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {status === 'loading' && (
        <>
          <Spinner />
          <div className="mt-2 text-gray-600">Creating your service domain...</div>
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
            }}
          >
            Retry
          </button>
        </>
      )}
      {status === 'success' && (
        <div className="text-green-600">Service domain created successfully!</div>
      )}
    </div>
  );
} 
