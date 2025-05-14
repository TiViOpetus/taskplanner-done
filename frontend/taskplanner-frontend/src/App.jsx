import React, { useEffect, useState } from "react";
import { getTasks } from "./api/taskApi";
import AddTaskForm from "./components/AddTaskForm";
import EditTaskForm from "./components/EditTaskForm";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const token = "0308b96aec560a874b810e1da899487c4b11feb3"; // Replace with your actual token

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };
  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setEditingTask(null);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getTasks(token);
      setTasks(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Task Planner</h1>
      {editingTask ? (
                <EditTaskForm
                    task={editingTask}
                    onTaskUpdated={handleTaskUpdated}
                    token={token}
                />
            ) : (
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            <strong>{task.title}</strong> - {task.description}
                            <button onClick={() => setEditingTask(task)}>Muokkaa</button>
                        </li>
                    ))}
                </ul>
            )}
    </div>
  );
}

export default App;