// A simple utility to decode JWT
export const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decodes the payload of the JWT
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  };
  