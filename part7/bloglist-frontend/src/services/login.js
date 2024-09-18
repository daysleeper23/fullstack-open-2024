import axios from "axios";
const baseUrl = "http://localhost:3003/api/login";

const login = async (username, password) => {
  console.log("start login");
  const response = await axios.post(baseUrl, { username, password });
  console.log("response", response.data);
  return response.data;
};

export default { login };
