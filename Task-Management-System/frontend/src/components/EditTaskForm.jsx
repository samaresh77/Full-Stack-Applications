import { useState } from "react";
import { updateTask } from "../services/taskApi";

function EditTaskForm({
  task,
  onTaskUpdated,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
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

      const data = await updateTask(
        task.id,
        formData
      );

      onTaskUpdated(data.task);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-task-form">
      <h3>Edit Task</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="edit-title">
            Title
          </label>

          <input
            id="edit-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="edit-description">
            Description
          </label>

          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="edit-status">
            Status
          </label>

          <select
            id="edit-status"
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
          <label htmlFor="edit-priority">
            Priority
          </label>

          <select
            id="edit-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Task"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditTaskForm;
