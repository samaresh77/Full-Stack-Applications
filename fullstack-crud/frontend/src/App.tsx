import Header from "./components/Header"
import TaskCard from "./components/TaskCard"

function App() {
  return (
    <div>
      <Header title="Task Management System" />

      <main>
        <h2>My Tasks</h2>

        <TaskCard
          title="Learn React + TypeScript"
          status="In Progress"
        />

        <TaskCard
          title="Build FastAPI Backend"
          status="Pending"
        />
      </main>
    </div>
  )
}

export default App