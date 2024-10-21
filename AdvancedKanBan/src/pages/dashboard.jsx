// src/pages/Dashboard.jsx
import React, { useState } from 'react';
// import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';
// import TaskColumn from '../components/TaskColumn';
// import TaskForm from '../components/TaskForm';
// import TaskDetails from '../components/TaskDetails';

const Dashboard = ({ user, setUser }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    underReview: [],
    done: [],
  });

  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="flex flex-col h-screen">
      <Header user={user} setUser={setUser} />
      <div className="flex flex-1 overflow-auto">
        <Sidebar />
        <div className="flex flex-1 p-4 space-x-4">
          <TaskForm setTasks={setTasks} />
          <TaskColumn
            title="To Do"
            tasks={tasks.todo}
            setTasks={setTasks}
            status="todo"
            setSelectedTask={setSelectedTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={tasks.inProgress}
            setTasks={setTasks}
            status="inProgress"
            setSelectedTask={setSelectedTask}
          />
          <TaskColumn
            title="Under Review"
            tasks={tasks.underReview}
            setTasks={setTasks}
            status="underReview"
            setSelectedTask={setSelectedTask}
          />
          <TaskColumn
            title="Done"
            tasks={tasks.done}
            setTasks={setTasks}
            status="done"
            setSelectedTask={setSelectedTask}
          />
        </div>
      </div>
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          setSelectedTask={setSelectedTask}
          setTasks={setTasks}
        />
      )}
    </div>
  );
};

export default Dashboard;
