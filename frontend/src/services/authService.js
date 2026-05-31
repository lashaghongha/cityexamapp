const API = "/api";

export const saveToken  = (token) => localStorage.setItem("jwt", token);
export const getToken   = ()      => localStorage.getItem("jwt");
export const removeToken = ()     => localStorage.removeItem("jwt");

export const saveUser   = (user)  => localStorage.setItem("user", JSON.stringify(user));
export const getUser    = ()      => JSON.parse(localStorage.getItem("user") || "null");
export const removeUser = ()      => localStorage.removeItem("user");

export function logout() {
  removeToken();
  removeUser();
}

export async function register({ name, email, phone, password }) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "რეგისტრაცია ვერ მოხერხდა");
  saveToken(data.token);
  saveUser(data.user);
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "შესვლა ვერ მოხერხდა");
  saveToken(data.token);
  saveUser(data.user);
  return data;
}

export async function googleLogin(idToken) {
  const res = await fetch(`${API}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Google შესვლა ვერ მოხერხდა");
  saveToken(data.token);
  saveUser(data.user);
  return data;
}

export function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
}
