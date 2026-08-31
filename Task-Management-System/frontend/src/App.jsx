import { useEffect, useState } from "react";

import {
  getTasks,
  deleteTask,
} from "./services/taskApi";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();

        setTasks(data.tasks);
      } catch (error) {
        console.error(error);

        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks((previousTasks) => [
      newTask,
      ...previousTasks,
    ]);
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      await deleteTask(taskId);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.id !== taskId
        )
      );
    } catch (error) {
      console.error(error);

      setError("Failed to delete task");
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div className="container header-content">
          <div>
            <h1>Task Manager</h1>
            <p>Organize your work and stay productive.</p>
          </div>

          <div className="task-counter">
            <span>{tasks.length}</span>
            <small>Tasks</small>
          </div>
        </div>
      </header>

      <main className="container main-content">
        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <section className="create-section">
          <TaskForm
            onTaskCreated={handleTaskCreated}
          />
        </section>

        <section className="tasks-section">
          <div className="section-header">
            <div>
              <h2>Your Tasks</h2>
              <p>
                Manage and track your tasks.
              </p>
            </div>

            <span className="task-count">
              {tasks.length}{" "}
              {tasks.length === 1
                ? "task"
                : "tasks"}
            </span>
          </div>

          <TaskList
            tasks={tasks}
            onTaskDeleted={handleTaskDeleted}
            onTaskUpdated={handleTaskUpdated}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
