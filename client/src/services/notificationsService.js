import http from "./httpService";
import { apiUrl } from "../config";

const apiEndpoint = apiUrl + "/notifications";

function appendId(id) {
  return `${apiEndpoint}/${id}`;
}

export function getNotifications(userId) {
  return http.get(appendId(userId));
}

export function deleteNotification(notificationId) {
  return http.delete(appendId(notificationId));
}
