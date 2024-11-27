// backend/controllers/resource.controller.js
import { Resource } from '../models/resource.model.js';

// Create a new resource
export const create = async (req, res) => {
  try {
    const newResource = new Resource({
      ...req.body,
      createdBy: req.user._id, // Assuming the user is authenticated and req.user is set
    });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all resources
export const getAll = async (req, res) => {
  try {
    const resources = await Resource.find().populate('createdBy', 'name').populate('comments.user', 'name');; // Populate createdBy with user name
    res.status(200).json(resources);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single resource by ID
export const getById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('createdBy', 'name');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing resource
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment
export const comment = async (req, res) => {
  try {
    const resource = await Resource.findById(req.body.resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    resource.comments.push({ user: req.user._id, text: req.body.text });
    await resource.save();
    res.status(200).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const react = async (req, res) => {
  try {
    const resource = await Resource.findById(req.body.resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const validTypes = ['like', 'dislike', 'love'];
    if (!validTypes.includes(req.body.type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const existingReaction = resource.reactions.find(
      (reaction) => reaction.user.equals(req.user._id) && reaction.type === req.body.type
    );
    if (existingReaction) {
      return res.status(400).json({ message: 'User already reacted with this type' });
    }

    resource.reactions.push({ user: req.user._id, type: req.body.type });
    await resource.save();

    res.status(200).json({ message: 'Reaction added successfully', reactions: resource.reactions });
  } catch (error) {
    console.error('Error in react API:', error); // Fixed error logging syntax
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
};
