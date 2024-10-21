import React, { useState } from 'react';

const TaskCreationForm = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 transition duration-150"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskCreationForm;
