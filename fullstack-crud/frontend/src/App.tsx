import Header from "./components/Header"
import TaskCard from "./components/TaskCard"

function App() {
  return (
    <div>
      <Header title="Task Management System" subtitle="Manage your daily work" />

      <main>
        <h2>My Tasks</h2>

        <TaskCard
          title="Learn TypeScript"
          status="completed"
          priority="high"
        />

        <TaskCard
          title="Build FastAPI Backend"
          status="in-progress"
          priority="high"
        />

        <TaskCard
          title="Learn Node.js"
          status="pending"
          priority="medium"
        />
      </main>
    </div>
  )
}

export default App