const ADMIN_SESSION_KEY = 'citizencare_admin_session';

export function getAdminSession() {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function isAdminLoggedIn() {
  return Boolean(getAdminSession()?.token);
}

export function saveAdminSession(session) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
