import { useQuery } from '@tanstack/react-query';
import { api } from '../api/queries.js';
import DeploymentStatus from './DeploymentStatus';
import { useDeployService } from '../hooks/useProjects.js';
import { useQueryClient } from '@tanstack/react-query';

export default function ServiceDetails({ service }) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceDetails', service.id],
    queryFn: () => api.getServiceDetails(service.id),
    enabled: !!service.id,
  });
  const deployServiceMutation = useDeployService();

  const handleRedeploy = (serviceId, environmentId) => {
    deployServiceMutation.mutate(
      { serviceId, environmentId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['serviceDetails', serviceId] });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="service-details space-y-2 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }
  
  if (error) return <div>Error loading service details</div>;

  const instances = data?.service?.serviceInstances?.edges ?? [];
  let allDomains = [];
  instances.forEach(instanceEdge => {
    const instance = instanceEdge.node;
    allDomains.push(...(instance.domains?.serviceDomains?.map(d => d.domain) ?? []));
    allDomains.push(...(instance.domains?.customDomains?.map(d => d.domain) ?? []));
  });

  const latestInstance = instances[0]?.node;
  const latestDeployment = latestInstance?.latestDeployment;
  const environmentId = latestInstance?.environmentId;
  const canRedeploy = latestDeployment && latestDeployment.status === 'SUCCESS' && environmentId && service.id;

  return (
    <div className="service-details space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{service.name}</h3>
        {latestDeployment ? (
          <DeploymentStatus deployment={latestDeployment} />
        ) : (
          <span className="text-xs text-gray-400">No deployment</span>
        )}
      </div>
      {canRedeploy && (
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 mt-1"
          onClick={() => handleRedeploy(service.id, environmentId)}
          disabled={deployServiceMutation.isPending}
        >
          {deployServiceMutation.isPending ? 'Redeploying...' : 'Redeploy'}
        </button>
      )}
      {allDomains.length > 0 ? (
        allDomains.map((domain, index) => (
          <div key={index} className="flex items-center space-x-2">
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              {domain}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(`https://${domain}`)}
              className="text-gray-400 hover:text-gray-600 text-xs"
              title="Copy URL"
            >
              📋
            </button>
          </div>
        ))
      ) : (
        <div className="text-xs text-gray-400">No domains</div>
      )}
    </div>
  );
} 
