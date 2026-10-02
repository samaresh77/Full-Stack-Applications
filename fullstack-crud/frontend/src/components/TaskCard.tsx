import type { Task } from "../types/task"

interface TaskCardProps {
  task: Task
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <div>
      <h4>{task.title}</h4>
      <p>Description: {task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {task.dueDate}</p>
    </div>
  )
}

export default TaskCard