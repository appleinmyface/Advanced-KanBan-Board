import React, { useState } from 'react';

const TaskDetailsModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const saveTask = () => {
    onSave({ ...task, title, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Edit Task</h2>
        <label className="block font-medium text-gray-600">Title</label>
        <input
          className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="block font-medium text-gray-600">Description</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 transition duration-150"
            onClick={saveTask}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-150"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
