// frontend/src/components/ResourceList.jsx
import  { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import ResourceDetail from './ResourceDetail';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resources</h1>
      {user && user.role === 'Admin' && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => setResources([...resources, { id: null, title: '', content: '' }])}
        >
          Add Resource
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <ResourceDetail key={resource._id} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
