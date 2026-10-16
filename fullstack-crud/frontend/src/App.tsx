import { useState } from "react"
import Header from "./components/Header"
import TaskCard from "./components/TaskCard"
import type { Task } from "./types/task"
import type { ChangeEvent, FormEvent } from "react"

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Learn TypeScript",
    description: "Learn interfaces and union types",
    status: "completed",
    priority: "high",
    dueDate: "2026-10-10",
  },
  {
    id: 2,
    title: "Build FastAPI Backend",
    description: "Create CRUD APIs using FastAPI",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-10-15",
  },
  {
    id: 3,
    title: "Learn Node.js",
    description: "Learn Node.js and Express",
    status: "pending",
    priority: "medium",
    dueDate: "2026-10-20",
  },
]


function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [taskTitle, setTaskTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTaskTitle(event.target.value)
  }
  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value)
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const newTask: Task = {
      id: Date.now(),
      title: taskTitle,
      description: description,
      status: "pending",
      priority: "medium",
      dueDate: "2026-10-20",
    }
    setTasks([...tasks, newTask])
    
    setTaskTitle("")
    setDescription("")

    console.log("Form submitted", tasks)
  }

  return (
    <div>
      <Header
        title="Task Management System"
        subtitle="Manage your daily work"
      />

      <main>
        <h2>My Tasks</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter task title"
            value={taskTitle}
            onChange={handleTitleChange}
          />

          <input
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={handleDescriptionChange}
          />

          <button type="submit">
            Add Task
          </button>
        </form>

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}
        <button onClick={() =>
          setTasks([...tasks, 
            {
              id: Date.now(),
              title: "Sample task",
              description: "Learn sample task",
              status: "pending",
              priority: "medium",
              dueDate: "2026-10-20",
            }
          ])}
          >
          Add Sample Task
        </button>
        <button onClick={() => {
            setTasks(tasks.slice(0, -1))
          }}
        >
          Remove Last Task
        </button>
        <button onClick={() => setTasks([])}>
          Delete All Tasks
        </button>
      </main>
    </div>
  )
}

export default App