import { useState } from "react";
import { createTask } from "../services/taskApi";

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await createTask(formData);

      onTaskCreated(data.task);

      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h2>Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">
              Pending
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">
              Medium
            </option>
            <option value="high">High</option>
          </select>
        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
