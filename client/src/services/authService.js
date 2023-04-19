import http from "./httpService";
import { apiUrl } from "../config";

const apiEndpoint = apiUrl + "/login";
const tokenKey = "token";

export async function login(credentials) {
  console.log("Inside login");
  console.log(process.env);
  console.log(apiEndpoint);
  const response = await http.post(apiEndpoint, credentials);
  // const { data: jwt } = await http.post(apiEndpoint, credentials);
  const jwt = response.data;
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}
