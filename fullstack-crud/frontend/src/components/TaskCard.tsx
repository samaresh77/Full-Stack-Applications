interface TaskCardProps {
  title: string
  status: string
}

function TaskCard({ title, status }: TaskCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>Status: {status}</p>
    </div>
  )
}

export default TaskCard