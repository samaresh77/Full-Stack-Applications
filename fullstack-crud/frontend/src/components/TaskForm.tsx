import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

interface TaskFormProps {
  onAddTask: (title: string, description: string) => void
}

function TaskForm({ onAddTask }: TaskFormProps) {
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

    onAddTask(taskTitle, description)

    setTaskTitle("")
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter task title"
        value={taskTitle}
        onChange={handleTitleChange}
      />

      <input
        type="text"
        placeholder="Enter description"
        value={description}
        onChange={handleDescriptionChange}
      />

      <button type="submit">
        Add Task
      </button>
    </form>
  )
}

export default TaskForm