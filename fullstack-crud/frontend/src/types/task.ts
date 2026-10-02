// Interface: Useful for describing the shape of objects
// ex. interface User {
//   id: number
//   name: string
// }
// Type: Very useful for unions and combining types
// ex. type Status = "pending" | "completed"

export interface Task {
  id: number
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
}