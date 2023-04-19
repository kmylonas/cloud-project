import axios from "axios";
import { toast } from "react-toastify";
import { getOauthToken } from "./oauth";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("An unexpected error occurrred.");
  }

  return Promise.reject(error);
});

axios.defaults.headers.common["X-Auth-Token"] = getOauthToken();

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
