import { useState } from "react";
import EditTaskForm from "./EditTaskForm";

function TaskCard({
  task,
  onTaskDeleted,
  onTaskUpdated,
}) {
  const [editing, setEditing] = useState(false);

  const handleUpdated = (updatedTask) => {
    onTaskUpdated(updatedTask);
    setEditing(false);
  };

  if (editing) {
    return (
      <EditTaskForm
        task={task}
        onTaskUpdated={handleUpdated}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>

        <span
          className={`status-badge ${task.status}`}
        >
          {task.status}
        </span>
      </div>

      <p className="task-description">
        {task.description ||
          "No description provided."}
      </p>

      <div className="task-meta">
        <span
          className={`priority-badge ${task.priority}`}
        >
          {task.priority} priority
        </span>
      </div>

      <div className="task-actions">
        <button
          onClick={() => setEditing(true)}
        >
          Edit
        </button>

        <button
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this task?"
            );

            if (confirmed) {
              onTaskDeleted(task.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
