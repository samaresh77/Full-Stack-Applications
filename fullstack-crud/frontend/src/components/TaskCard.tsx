interface TaskCardProps {
  title: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
}

function TaskCard({ title, status, priority }: TaskCardProps) {
  return (
    <div>
      <h4>{title}</h4>
      <p>Status: {status}</p>
      <p>Priority: {priority}</p>
    </div>
  )
}

export default TaskCard