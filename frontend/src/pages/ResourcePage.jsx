import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResourceDetail from '../components/ResourceDetail';
import ResourceForm from '../components/ResourceForm';

const ResourcePage = () => {
  const [resources, setResources] = useState([]); // Initialize as an empty array
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/resources');
      setResources(response.data);
      console.log('Resources:', response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSave = () => {
    setEditingResource(null);
    fetchResources();
  };

  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center bg-slate-50 mb-6">Products</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-gray-600 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
          onClick={handleDashboardNavigation}
        >
          Go to Dashboard
        </button>
        {user && user.role === 'Admin' && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              setEditingResource({
                id: null,
                title: '',
                content: '',
                price: 0,
                qty: 0,
                category: '',
              })
            }
          >
            Add Product
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center font-semibold mb-4">{error}</p>
      )}

      {editingResource && (
        <ResourceForm resource={editingResource} onSave={handleSave} />
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading resources...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <ResourceDetail
                key={resource._id}
                resource={resource}
                onEdit={() => setEditingResource(resource)}
                onDelete={() =>
                  setResources(resources.filter((r) => r._id !== resource._id))
                }
                fetchResources={fetchResources}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No resources available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourcePage;
