import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

export const getTasks = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};