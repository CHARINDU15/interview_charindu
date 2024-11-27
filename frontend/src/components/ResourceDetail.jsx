import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import CommentForm from "./CommentForm";
import Reaction from "./Reaction";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const ResourceDetail = ({ resource, fetchResources }) => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(resource.title);
  const [content, setContent] = useState(resource.content);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments] = useState(resource.comments);
  const token = localStorage.getItem("authToken");
  const [likes] = useState(
    resource.reactions.filter((r) => r.type === "like").length
  );
  const [unlikes] = useState(
    resource.reactions.filter((r) => r.type === "unlike").length
  );

  useEffect(() => {
    if (resource.reactions.some((reaction) => reaction.user === user?._id)) {
      setHasLiked(true);
    }
  }, [resource.reactions, user]);

  const handleDelete = async () => {
    try {
      console.log("Deleting resource:", hasLiked);
      await api.delete(`/resources/${resource._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(
        `/resources/${resource._id}`,
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditing(false);
      fetchResources();
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 shadow-xl rounded-lg p-6 mb-8 border border-gray-200 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      {isEditing ? (
        <>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Add Product
          </h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-black rounded-lg w-full py-3 px-4 mb-4 focus:ring-2 focus:ring-indigo-300"
            placeholder="Resource Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 rounded-lg w-full py-3 px-4 mb-4 focus:ring-2 focus:ring-indigo-300"
            rows="4"
            placeholder="Resource Content"
          />
          <div className="flex justify-between mt-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {resource.title}
          </h2>
          <p className="text-gray-900 mb-4 max-h-48 overflow-y-auto">
            {resource.content}
          </p>
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
            <p className="text-gray-800">
              <strong>Price:</strong> ${resource.price}
            </p>
            <p className="text-gray-800">
              <strong>Quantity:</strong> {resource.qty}
            </p>
            <p className="text-gray-800">
              <strong>Category:</strong> {resource.category}
            </p>
          </div>

          <p className="text-gray-600 mb-2">
            Added by: <strong>{resource.createdBy.name}</strong>
          </p>
          <div className="flex items-center justify-between my-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-green-600 hover:text-green-700">
                <FaThumbsUp className="mr-1" />
                {likes} {likes === 1 ? "Like" : "Likes"}
              </span>
              <span className="flex items-center text-red-600 hover:text-red-700">
                <FaThumbsDown className="mr-1" />
                {unlikes} {unlikes === 1 ? "Unlike" : "Unlikes"}
              </span>
            </div>
            {user && user.role === "Admin" && (
              <div className="flex space-x-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  onClick={() => setIsEditing(true)}
                >
                  Modify
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  onClick={handleDelete}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <div className="border-t border-gray-300 my-4" />
        </>
      )}
      <div className="mt-6">
        <h4
          className="text-xl font-semibold text-gray-800 flex items-center cursor-pointer"
          onClick={() => setCommentsVisible(!commentsVisible)}
        >
          Comments
          {commentsVisible ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </h4>
        {commentsVisible && (
          <>
            <CommentForm
              resourceId={resource._id}
              fetchResources={fetchResources}
            />
            <div className="mt-4 space-y-4 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
                >
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-gray-600 text-sm">
                    Comment by: <strong>{comment.user.name}</strong> on{" "}
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Reactions:</h4>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Reaction resourceId={resource._id} fetchResources={fetchResources} />
        </div>
      </div>
    </div>
  );
};

ResourceDetail.propTypes = {
  resource: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    qty: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
    }).isRequired,
    reactions: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired,
          _id: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  fetchResources: PropTypes.func.isRequired,
};

export default ResourceDetail;
