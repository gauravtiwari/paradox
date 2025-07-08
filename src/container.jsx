import { useQuery } from '@tanstack/react-query';
import Spinner from './Spinner';
import { getServiceDetails } from './api/queries.js';

export default function Container({ item, refetch }) {
  const services = item.services?.edges ?? [];
  return (
    <div className="container-card">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {services.length === 0 ? (
        <div>No services</div>
      ) : (
        services.map(serviceEdge => (
          <ServiceDetails key={serviceEdge.node.id} service={serviceEdge.node} />
        ))
      )}
    </div>
  );
}

function ServiceDetails({ service }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceDetails', service.id],
    queryFn: () => getServiceDetails(service.id),
    enabled: !!service.id,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading service details</div>;
  
  const instances = data?.serviceInstances?.edges ?? [];
  return (
    <div className="service-details">
      <strong>{service.name}</strong>
      {instances.map(instanceEdge => (
        <div key={instanceEdge.node.id}>
          <div>Domains: {[
            ...(instanceEdge.node.domains?.serviceDomains?.map(d => d.domain) ?? []),
            ...(instanceEdge.node.domains?.customDomains?.map(d => d.domain) ?? [])
          ].join(', ') || 'None'}</div>
          <div>Status: {instanceEdge.node.latestDeployment?.status ?? 'Unknown'}</div>
        </div>
      ))}
    </div>
  );
} 
