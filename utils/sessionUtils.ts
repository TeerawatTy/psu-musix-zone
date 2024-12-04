// utils/sessionUtils.ts

// Decode the JWT token (if you're using JWT)
export const decodeToken = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

// Validate the session (check expiration and other conditions)
export const validateSession = (sessionCookie: string) => {
  try {
    const decodedSession = decodeToken(sessionCookie);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // Check if the session is expired
    if (decodedSession.exp < currentTime) {
      throw new Error("Session expired");
    }

    // Optionally check for additional conditions (e.g., admin check)
    if (decodedSession.role !== "admin" && decodedSession.role !== "user") {
      throw new Error("Invalid role");
    }

    // If all checks pass, return the valid session
    return decodedSession;
  } catch (error) {
    console.error("Invalid session:", error);
    return null; // Invalid session
  }
};
