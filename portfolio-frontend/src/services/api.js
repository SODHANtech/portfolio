import axios from "axios";

const api = axios.create({
  baseURL: "https://portfolio-8n8t.onrender.com/api",
});

export default api;