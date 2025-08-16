import { authService } from "../services/authService";
import { toast } from "sonner";

export function useLogout() {
  const logout = () => {
    authService.logout();
    toast.success("Logged out successfully");
  };
  return { logout };
}
