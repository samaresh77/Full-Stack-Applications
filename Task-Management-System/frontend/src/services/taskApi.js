import axios from "axios";

const API_URL = "http://localhost:5001/api/tasks";

// CREATE
export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);

  return response.data;
};

// READ ALL
export const getTasks = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

// READ ONE
export const getTask = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data;
};

// UPDATE
export const updateTask = async (id, taskData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    taskData
  );

  return response.data;
};

// DELETE
export const deleteTask = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};