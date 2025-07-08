import { useState } from "react";
import DeleteModal from './DeleteModal.jsx';
import ServiceDetails from './ServiceDetails.jsx';
import { useDeleteProject } from '../hooks/useProjects.js';

export default function Container({ project, refetch }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const mutation = useDeleteProject();

  const handleDelete = () => {
    mutation.mutate({ id: project.id }, {
      onSuccess: (data) => {
        setDeleteOpen(false);
        if (refetch) refetch();
      },
      onError: (error) => {
        setDeleteOpen(false);
        if (refetch) refetch();
      },
    });
  };

  const showDeleteButton = project.name !== 'Paradox';
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow flex flex-col gap-2 relative">
      {showDeleteButton && <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={mutation.isPending}
        projectName={project.name}
      />}
      {showDeleteButton && (
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold mb-1 text-gray-900">{project.name}</h1>
          {project.description && <p className="text-gray-500 text-sm mb-2">{project.description}</p>}
        </div>
        <button
          className="ml-4 px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
          onClick={() => {
            setDeleteOpen(true);
          }}
        >
          Delete
        </button>
      </div>
      )}

      {project.services?.edges?.length > 0 && (
        <div className="mt-4 space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Services</h2>
          {project.services.edges.map((edge) => (
            <ServiceDetails key={edge.node.id} service={edge.node} />
          ))}
        </div>
      )}
    </div>
  );
} 
