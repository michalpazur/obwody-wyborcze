import _axios from "axios";

const axios = _axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default axios;
