import Header from "./components/Header"
import TaskCard from "./components/TaskCard"
import type { Task } from "./types/task"

function App() {
  const task1: Task = {
    id: 1,
    title: "Learn TypeScript",
    description: "Learn interfaces and union types",
    status: "completed",
    priority: "high",
    dueDate: "2026-10-10"
  }

  const task2: Task = {
    id: 2,
    title: "Build FastAPI Backend",
    description: "Create CRUD APIs using FastAPI",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-10-11"
  }

  const task3: Task = {
    id: 3,
    title: "Learn Node.js",
    description: "Learn Node.js and Express",
    status: "pending",
    priority: "medium",
    dueDate: "2026-10-12"
  }

  return (
    <div>
      <Header
        title="Task Management System"
        subtitle="Manage your daily work"
      />

      <main>
        <h2>My Tasks</h2>

        <TaskCard task={task1} />
        <TaskCard task={task2} />
        <TaskCard task={task3} />
      </main>
    </div>
  )
}

export default App