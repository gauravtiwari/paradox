import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import Container from './components/Container.jsx'
import CreateModal from './components/CreateModal.jsx'
import railwayLogo from '/railway.svg'
import './application.css'
import { useProjects } from './hooks/useProjects.js'
import Spinner from './components/Spinner.jsx'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const teamId = import.meta.env.VITE_RAILWAY_TEAM_ID;
  const { data, isLoading, error, refetch } = useProjects(teamId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner />
        <div className="mt-4 text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Error loading projects</div>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-10">
      <CreateModal open={modalOpen} onClose={() => setModalOpen(false)} refetch={refetch} />
      <div className="flex justify-center items-center my-24">
        <a href="https://railway.com" target="_blank">
          <img src={railwayLogo} alt="Railway Logo" className="w-10 h-10"/>
        </a>
      </div>
      <div className="container mx-auto lg:max-w-2xl md:max-w-xl sm:max-w-md mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Containers</h2>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Create Container
          </button>
        </div>
        {!data?.projects?.edges || data?.projects?.edges?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" /></svg>
            <div className="text-lg font-medium">No containers created yet</div>
            <div className="text-sm mt-2">Click "Create Container" to get started.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.projects.edges.map((edge, idx) => (
              <Container project={edge.node} key={edge.node.id ?? idx} refetch={refetch} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 
