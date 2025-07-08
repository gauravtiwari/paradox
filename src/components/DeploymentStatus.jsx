import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDeploymentStatus } from '../api/queries.js';

const getStatusColor = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'FAILED':
    case 'CRASHED':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'BUILDING':
    case 'DEPLOYING':
    case 'INITIALIZING':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'QUEUED':
    case 'WAITING':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'SLEEPING':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'SUCCESS':
      return '✅';
    case 'FAILED':
    case 'CRASHED':
      return '❌';
    case 'BUILDING':
    case 'DEPLOYING':
    case 'INITIALIZING':
      return '🔄';
    case 'QUEUED':
    case 'WAITING':
      return '⏳';
    case 'SLEEPING':
      return '😴';
    default:
      return '❓';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'Deployed';
    case 'FAILED':
      return 'Failed';
    case 'CRASHED':
      return 'Crashed';
    case 'BUILDING':
      return 'Building';
    case 'DEPLOYING':
      return 'Deploying';
    case 'INITIALIZING':
      return 'Initializing';
    case 'QUEUED':
      return 'Queued';
    case 'WAITING':
      return 'Waiting';
    case 'SLEEPING':
      return 'Sleeping';
    case 'REMOVED':
      return 'Removed';
    case 'REMOVING':
      return 'Removing';
    case 'SKIPPED':
      return 'Skipped';
    default:
      return status;
  }
};

const isActiveState = (status) => {
  if (status == null) return true;
  return ['BUILDING', 'DEPLOYING', 'INITIALIZING', 'QUEUED', 'WAITING'].includes(status);
};

export default function DeploymentStatus({ deployment }) {
  const currentStatus = deployment.status;
  const shouldPoll = isActiveState(currentStatus);

  const { data, isFetching } = useQuery({
    queryKey: ['deploymentStatus', deployment.id],
    queryFn: () => getDeploymentStatus(deployment.id),
    refetchInterval: shouldPoll ? 5000 : false,
    initialData: deployment,
  });

  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const updatedAt = new Date(data?.statusUpdatedAt || data?.updatedAt || deployment.statusUpdatedAt || deployment.updatedAt);
      const diffMs = now.getTime() - updatedAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        setTimeAgo(`${diffDays}d ago`);
      } else if (diffHours > 0) {
        setTimeAgo(`${diffHours}h ago`);
      } else if (diffMins > 0) {
        setTimeAgo(`${diffMins}m ago`);
      } else {
        setTimeAgo('Just now');
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000);
    return () => clearInterval(interval);
  }, [data?.statusUpdatedAt, data?.updatedAt, deployment.statusUpdatedAt, deployment.updatedAt]);

  const status = data?.status || deployment.status;
  const isActive = isActiveState(status);
  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  const statusText = getStatusText(status);

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
        <span>{statusIcon}</span>
        <span>{statusText}</span>
        {isFetching && shouldPoll && (
          <div className="w-2 h-2 bg-current rounded-full animate-spin ml-1 opacity-60"></div>
        )}
      </div>
      {isActive && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      )}
      <span className="text-xs text-gray-400">{timeAgo}</span>
    </div>
  );
} 
