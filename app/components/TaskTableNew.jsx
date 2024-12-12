'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddTaskForm from './AddTaskForm';
import SearchForm from './SearchForm';
import Toast from './Toast';
import { toast } from 'react-toastify';

const TaskTableNew = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskCategory, setTaskCategory] = useState({
    doneTask: 0,
    todTask: 0,
    inProgressTask: 0
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=20'
      );
      const data = await response.json();
      const mappedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        description: '',
        status: task.completed ? 'Done' : 'To Do',
      }));
      setTasks(mappedTasks);
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // Reset counts
    let done = 0;
    let todo = 0;
    let inProgress = 0;

    // Count tasks by status
    tasks.forEach((task) => {
      if (task.status === 'Done') {
        done++;
      } else if (task.status === 'To Do') {
        todo++;
      } else if (task.status === 'In Progress') {
        inProgress++;
      }
    });

    // Update state with new counts
    setTaskCategory({
      doneTask: done,
      todTask: todo,
      inProgressTask: inProgress
    });

    console.log(taskCategory);
  }, [tasks]);

  const handleRowUpdate = (updatedRow, originalRow) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedRow.id ? { ...task, ...updatedRow } : task
      )
    );
    toast.success('Task updated successfully!');
    return updatedRow; // Return the updated row to confirm the update
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow-500';
      case 'To Do':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Task ID',
      width: 90,
      editable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
      editable: true,
      renderCell: (params) => {
        const { value } = params;
        if (!searchTerm) return value; // Return the value as is if searchTerm is empty
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = value.split(regex);
        return (
          <span>
            {parts.map((part, index) =>
              regex.test(part) ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </span>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      flex: 1,
      editable: true,
      renderCell: (params) => {
        const { value } = params;
        if (!searchTerm) return value; // Return the value as is if searchTerm is empty
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = value.split(regex);
        return (
          <span>
            {parts.map((part, index) =>
              regex.test(part) ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['To Do', 'In Progress', 'Done'],
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="w-full flex justify-center">
          <span className={`${getStatusColor(params.value)} text-white px-3 py-1 mt-3 rounded-full text-sm`}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <button
          onClick={() => {
            setTasks((tasks) =>
              tasks.filter((task) => task.id !== params.row.id)
            );
            toast.success('Task deleted successfully!');
          }}
          className="px-2 py-1 text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      ),
    },
  ];

  const addTask = (task) => {
    setTasks([...tasks, task]);
    toast.success('Task added successfully!');
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <Toast />
      <SearchForm search={searchTerm} setSearch={setSearchTerm} />
      <AddTaskForm addTask={addTask} length={tasks.length}/>

      <div className="flex flex-col justify-between space-x-4 md:flex-row text-center ">
        <p className="border rounded-full px-6 py-1 bg-green-500 text-white ml-4">Done Tasks: {taskCategory.doneTask}</p>
        <p className="border rounded-full px-6 py-1 bg-blue-500 text-white">To Do Tasks: {taskCategory.todTask}</p>
        <p className="border rounded-full px-6 py-1 bg-yellow-500 text-white">In Progress Tasks: {taskCategory.inProgressTask}</p>
      </div>

      <div className="my-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        
        <select
          className="border rounded p-1"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <p className="text-xs text-gray-500 text-center"> Double click to edit</p>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredTasks}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          processRowUpdate={handleRowUpdate}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid #e5e7eb',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
            },
          }}
        />
      </div>
    </div>
  );
};

export default TaskTableNew;