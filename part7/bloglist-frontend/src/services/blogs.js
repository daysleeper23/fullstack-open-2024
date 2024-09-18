import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;
const setToken = async (newToken) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => {
  return token;
};

const getAll = async () => {
  // console.log('get blogs with token:', token)
  const response = await axios.get(baseUrl, {
    headers: { Authorization: token },
  });
  return response.data;
};

const createNew = async (newObject) => {
  // console.log('create blogs with token:', token)
  const response = await axios.post(baseUrl, newObject, {
    headers: { Authorization: token },
  });
  return response.data;
};

const updateOne = async (newObject, objectId) => {
  const response = await axios.put(`${baseUrl}/${objectId}`, newObject, {
    headers: { Authorization: token },
  });
  return response.data;
};

const deleteOne = async (objectId) => {
  const response = await axios.delete(`${baseUrl}/${objectId}`, {
    headers: { Authorization: token },
  });
  return response.data;
};

export default { getAll, createNew, updateOne, deleteOne, setToken, getToken };
