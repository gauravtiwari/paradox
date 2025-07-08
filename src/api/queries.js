import { graphqlRequest } from './client.js';

export async function getDeploymentStatus(deploymentId) {
  const query = `
    query DeploymentStatusQuery($deploymentId: String!) {
      deployment(id: $deploymentId) {
        id
        status
        statusUpdatedAt
        updatedAt
      }
    }
  `;
  const response = await graphqlRequest(query, { deploymentId });
  return response.data?.deployment || {};
}

export const api = {
   async  getProjects(teamId) {
    const query = `
      query AppProjectsQuery($teamId: String) {
        projects(teamId: $teamId) {
          edges {
            node {
              id
              name
              description
              services {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;
    const response = await graphqlRequest(query, { teamId });
    return response.data;
  },
  
  async  getServiceDetails(serviceId) {
    const query = `
      query ServiceDetailsQuery($serviceId: String!) {
        service(id: $serviceId) {
          id
          serviceInstances {
            edges {
              node {
                id
                domains {
                  serviceDomains { domain }
                  customDomains { domain }
                }
                latestDeployment {
                  id
                  status
                  createdAt
                  updatedAt
                  statusUpdatedAt
                  url
                  staticUrl
                  instances { status }
                }
              }
            }
          }
        }
      }
    `;
    const response = await graphqlRequest(query, { serviceId });
    return response.data;
  },
  
  async createProject(data) {
    const mutation = `
      mutation CreateProject($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
          id
          name
          environments {
            edges {
              node {
                id
                name
              }
            }
          }
          services {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `;
    const input = {
      name: data.name,
      description: data.description,
      defaultEnvironmentName: 'production',
      teamId: import.meta.env.VITE_RAILWAY_TEAM_ID,
    };
    try {
      const response = await graphqlRequest(mutation, { input });
      return response.data;
    } catch (err) {
      throw new Error(err.message || 'Failed to create project');
    }
  },

  async createService(data) {
    const mutation = `
      mutation CreateService($input: ServiceCreateInput!) {
        serviceCreate(input: $input) {
          id
          name
        }
      }
    `;
    const input = {
      projectId: data.projectId,
      name: `${data.name}-service`,
      branch: data.branch,
    };
    if (data.repo) input.source = { repo: data.repo };
    try {
      const response = await graphqlRequest(mutation, { input });
      return response.data;
    } catch (err) {
      throw new Error(err.message || 'Failed to create service');
    }
  },

  async updateService(data) {
    const mutation = `
      mutation ServiceInstanceUpdate($environmentId: String, $serviceId: String!, $input: ServiceInstanceUpdateInput!) {
        serviceInstanceUpdate(environmentId: $environmentId, serviceId: $serviceId, input: $input)
      }
    `;
    const input = {
      builder: 'RAILPACK',
    };
 
    if (data.buildCommand) input.buildCommand = data.buildCommand;
    if (data.startCommand) input.startCommand = data.startCommand;
    try {
      const response = await graphqlRequest(mutation, {
        environmentId: data.environmentId,
        serviceId: data.serviceId,
        input: input,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.message || 'Failed to update service instance');
    }
  },

  async deployService(data) {
    const mutation = `
      mutation DeployService($serviceId: String!, $environmentId: String!, $latestCommit: Boolean) {
        serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId, latestCommit: $latestCommit)
      }
    `;
    try {
      const response = await graphqlRequest(mutation, {
        serviceId: data.serviceId,
        environmentId: data.environmentId,
        latestCommit: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.message || 'Failed to deploy service');
    }
  },

  async deleteProject(data) {
    const mutation = `
      mutation DeleteProject($id: String!) {
        projectDelete(id: $id)
      }
    `;

    const variables = {
      id: data.id,
    };
    
    const response = await graphqlRequest(mutation, variables);
    return response.data;
  },

  async serviceDomainCreate({ environmentId, serviceId, targetPort = 3000 }) {
    const mutation = `
      mutation ServiceDomainCreate($input: ServiceDomainCreateInput!) {
        serviceDomainCreate(input: $input) {
          id
          domain
        }
      }
    `;
    const input = { environmentId, serviceId, targetPort };
    try {
      const response = await graphqlRequest(mutation, { input });
      return response.data;
    } catch (err) {
      throw new Error(err.message || 'Failed to create service domain');
    }
  },
}; 
