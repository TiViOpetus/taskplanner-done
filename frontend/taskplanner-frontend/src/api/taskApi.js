import axios from "axios";

 
const API_URL = "http://127.0.0.1:8000/api/tasks/";
const API_TASKCLASS_URL = "http://127.0.0.1:8000/api/task_classes/";
 
export const getTasks = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

export const getTaskClasses = async (token) => {
  const response = await axios.get(API_TASKCLASS_URL, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};
