const pool = require("../config/db");

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tasks (title, description, status, priority)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        title,
        description || null,
        status || "pending",
        priority || "medium",
      ]
    );

    res.status(201).json({
      message: "Task created successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Create task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: result.rows,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Get task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      status,
      priority,
    } = req.body;

    // Check if task exists
    const existingTask = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );

    if (existingTask.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Update task
    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = $1,
        description = $2,
        status = $3,
        priority = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [
        title,
        description,
        status,
        priority,
        id,
      ]
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};