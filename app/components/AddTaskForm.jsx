'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddTaskForm = ({ addTask, length }) => {
  
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.title.trim() === '') {
      toast.error('Title is required!');
      return;
    }

    addTask({
      ...task,
      id: length + 1,
    });

    toast.success('Task added successfully!');

    setTask({
      title: '',
      description: '',
      status: 'To Do',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full justify-center items-center">
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="border p-2 rounded w-64"
        value={task.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        className="border p-2 rounded w-full"
        value={task.description}
        onChange={handleChange}
      />
      <select
        name="status"
        className="border p-2 rounded w-32"
        value={task.status}
        onChange={handleChange}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-48"
      >
        Add
      </button>
    </form>
  );
};

export default AddTaskForm; 