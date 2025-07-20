export function logout() {
  localStorage.removeItem("token"); // hapus token
  window.location.href = "/"; // redirect ke landing page
}
