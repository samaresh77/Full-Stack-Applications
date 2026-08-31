import TaskCard from "./TaskCard";

function TaskList({ tasks, onTaskDeleted, onTaskUpdated }) {
  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskDeleted={onTaskDeleted}
          onTaskUpdated={onTaskUpdated}
        />
      ))}
    </div>
  );
}

export default TaskList;
