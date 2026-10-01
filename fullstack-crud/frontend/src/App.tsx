import './App.css'

function App() {
  const appName: string = "Task Management System"
  const version: number = 1
  const production: boolean = false

  return (
    <div>
      <h1>{appName}</h1>
      <p>Versions: {version}</p>
      <p>Production: {production ? "Yes" : "No"}</p>
    </div>
  )
}

export default App
