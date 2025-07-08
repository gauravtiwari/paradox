import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ProjectCreateStep from './steps/ProjectCreateStep.jsx';
import ServiceCreateStep from './steps/ServiceCreateStep.jsx';
import ServiceUpdateStep from './steps/ServiceUpdateStep.jsx';
import ServiceDeployStep from './steps/ServiceDeployStep.jsx';
import ServiceDomainStep from './steps/ServiceDomainStep.jsx';
import ModalLayout from './ModalLayout.jsx';

export default function CreateModal({ open, onClose, refetch }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [environmentId, setEnvironmentId] = useState(null);
  const [formValues, setFormValues] = useState(null);

  if (!open) return null;

  const handleClose = () => {
    setStep(0);
    setError(null);
    setProjectData(null);
    setServiceId(null);
    setEnvironmentId(null);
    setFormValues(null);
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    if (serviceId) {
      queryClient.invalidateQueries({ queryKey: ['serviceDetails', serviceId] });
    }
    onClose();
  };

  let stepContent = null;
  let title = '';

  if (step === 0) {
    title = 'Create Container';
    stepContent = (
      <ProjectCreateStep
        onSuccess={(projectId, envId, name, repo, branch, buildCommand, startCommand, port) => {
          setProjectData({ projectId, name, repo, branch, buildCommand, startCommand, port });
          setEnvironmentId(envId);
          setFormValues({ name, repo, branch, buildCommand, startCommand, port });
          setStep(1);
        }}
        onError={setError}
      />
    );
  } else if (step === 1) {
    title = 'Create Service';
    const { name, repo, branch } = formValues;
    stepContent = (
      <ServiceCreateStep
        projectId={projectData.projectId}
        name={name}
        repo={repo}
        branch={branch}
        onSuccess={(id) => {
          setServiceId(id);
          setStep(2);
        }}
        onError={setError}
      />
    );
  } else if (step === 2) {
    title = 'Update Service';
    stepContent = (
      <ServiceUpdateStep
        environmentId={environmentId}
        serviceId={serviceId}
        buildCommand={projectData.buildCommand}
        startCommand={projectData.startCommand}
        onSuccess={() => setStep(3)}
        onError={setError}
      />
    );
  } else if (step === 3) {
    title = 'Deploy Service';
    stepContent = (
      <ServiceDeployStep
        serviceId={serviceId}
        environmentId={environmentId}
        onSuccess={() => {
          if (refetch) refetch();
          setStep(4);
        }}
        onError={setError}
      />
    );
  } else if (step === 4) {
    title = 'Create Domain';
    stepContent = (
      <ServiceDomainStep
        environmentId={environmentId}
        serviceId={serviceId}
        port={projectData?.port || 3000}
        onSuccess={() => {
          setStep(5);
        }}
        onError={setError}
      />
    );
  } else if (step === 5) {
    title = 'Container Created!';
    stepContent = (
      <>
        <div className="text-green-600 text-3xl mb-4">✓</div>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleClose}
        >
          Close
        </button>
      </>
    );
  }

  return (
    <ModalLayout title={title} onClose={handleClose}>
      {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
      {stepContent}
    </ModalLayout>
  );
} 
