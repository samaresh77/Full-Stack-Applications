import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);


  // =========================================================
  // CHECK EXISTING LOGIN
  // =========================================================

  useEffect(() => {

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }


    const checkAuthentication = async () => {

      try {

        const response =
          await api.get("/auth/me", {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          });


        setUser(response.data);

      } catch (error) {

        console.error(
          "Authentication check failed:",
          error
        );


        localStorage.removeItem("token");

        setToken(null);

        setUser(null);

      } finally {

        setLoading(false);

      }
    };


    checkAuthentication();

  }, [token]);


  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (
  username,
  password,
  role
) => {

  const response =
    await api.post(
      "/auth/login",
      {
        username,
        password,
        role,
      }
    );


  const accessToken =
    response.data.access_token;


  if (!accessToken) {
    throw new Error(
      "Access token was not returned by the server."
    );
  }


  localStorage.setItem(
    "token",
    accessToken
  );

  setToken(accessToken);


  const userResponse =
    await api.get(
      "/auth/me",
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      }
    );


  const loggedInUser =
    userResponse.data;


  setUser(loggedInUser);


  return loggedInUser;
};

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    setToken(null);

    setUser(null);
  };


  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =========================================================
// USE AUTH
// =========================================================

export function useAuth() {
  return useContext(AuthContext);
}