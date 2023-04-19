import http from "./httpService";
// import configData from "../config.json"
import { apiUrl } from "../config";

const apiEndpoint = apiUrl + "/users";

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndpoint);
}

export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}

export function updateUser(newUser) {
  return http.put(apiEndpoint, newUser);
}

export function register(data) {
  return http.post(apiEndpoint, data);
}
