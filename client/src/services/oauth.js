import jwtDecode from "jwt-decode";

export function getOauthToken() {
  try {
    const jwt = localStorage.getItem("token");
    const decoded = jwtDecode(jwt);
    const oauthToken = decoded.oauth;
    return oauthToken;
  } catch (ex) {
    console.log(ex);
  }
}
