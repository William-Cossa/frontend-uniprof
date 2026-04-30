import * as jose from "jose";
import { cookies } from "next/headers";

export async function isValidSession() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("unimentors_token");

    if (sessionToken) {
      const { value } = sessionToken;
      const payload = jose.decodeJwt(value);
      const currentDate = new Date().getTime();

      if (payload.exp) {
        return (payload.exp * 1000) > currentDate;
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
}

export async function destroySession() {
  try {
    cookies().delete("unimentors_token");
  } catch (error) {
    console.error("Failed to destroy session:", error);
  }
}

export async function getAuthToken() {
  try {
    return cookies().get("unimentors_token")?.value;
  } catch(error) {
    return null;
  }
}

const AuthServices = {
  isValidSession,
  destroySession,
  getAuthToken
};

export default AuthServices;
