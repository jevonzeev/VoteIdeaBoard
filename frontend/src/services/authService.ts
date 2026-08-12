import api from "../lib/axios";
import type { User } from "../types";

export const AuthService = {
  me: () => api.get<User>("/auth/me/").then((r) => r.data),
  login: (username: string, password: string) =>
    api.post<User>("/auth/login/", { username, password }).then((r) => r.data),
  logout: () => api.post("/auth/logout/"),
};
