// frontend/src/components/Reaction.jsx
import api from '../services/api';

import PropTypes from 'prop-types';
import {useAuthStore} from '../store/authStore.js';

const Reaction = ({ resourceId,fetchResources}) => {
 
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  const { user } = useAuthStore();
  const userid = user._id;


  const handleReact = async (type) => {
    console.log('Submitting lll...', token);
    console.log('Resource ID:', resourceId);
    console.log('Type:', type);
    console.log('User ID:', userid);
    try {
      await api.post('/resources/react', { resourceId,user,type }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
      // Refresh reactions or handle in parent component
    } catch (error) {
      console.error('Error adding reaction:', error.response.data);
    }
  };

  return (
    <div className="mt-4">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={() => handleReact('like')}
      >
        Like
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleReact('dislike')}
      >
        Dislike
      </button>
    </div>
  );
};

Reaction.propTypes = {
  resourceId: PropTypes.string.isRequired,
  fetchResources: PropTypes.func.isRequired,
};

export default Reaction;