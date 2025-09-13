import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authService } from "../services/authService";
import { AuthResponse, SignInPayload, SignUpPayload } from "../types/auth";

export interface AuthErrorParsed {
  rootError: string;
  fieldErrors: Record<string, string>;
}

export const parseAuthError = (err: any): AuthErrorParsed => {
  const fe: Record<string, string> = {};
  let re = "Something went wrong";

  // AxiosError
  if (err?.isAxiosError) {
    const data = (err as AxiosError<any>).response?.data;
    if (data) {
      if (Array.isArray(data.errors)) {
        data.errors.forEach((e: { path: string; message: string }) => {
          fe[e.path] = e.message || "";
        });
      }
      if (data.message) re = data.message;
    }
  }
  // fallback generic Error
  else if (err instanceof Error) {
    re = err.message;
  }

  return { rootError: re, fieldErrors: fe };
};

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();
  const router = useRouter();

  const signInMutation = useMutation<AuthResponse, AxiosError, SignInPayload>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (res) => {
      const token = res.data?.token;
      const email = res.data?.user?.email;
      if (token && email) {
        setAuth({ isLoggedIn: true, token, email });
        showSuccess(res.message);
        router.replace("/links");
      } else {
        showError(res.message);
      }
    },
    onError: (err: AxiosError) => {
      const { rootError } = parseAuthError(err);
      showError(rootError);
    },
  });

  const signUpMutation = useMutation<AuthResponse, AxiosError, SignUpPayload>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (res) => {
      const token = res.data?.token;
      const email = res.data?.user?.email;
      if (token && email) {
        setAuth({ isLoggedIn: true, token, email });
        showSuccess(res.message);
        router.replace("/links");
      } else {
        showError(res.message);
      }
    },
    onError: (err: AxiosError) => {
      const { rootError } = parseAuthError(err);
      showError(rootError);
      return parseAuthError(err); // agar container bisa pakai fieldErrors
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => true,
    onSuccess: () => {
      clearAuth();
      showSuccess("Signed out successfully");
      router.replace("/");
    },
    onError: () => showError("Sign out failed"),
  });

  return {
    signIn: signInMutation.mutate as unknown as UseMutateFunction<
      AuthResponse,
      AuthErrorParsed,
      SignInPayload,
      unknown
    >,
    signUp: signUpMutation.mutate as unknown as UseMutateFunction<
      AuthResponse,
      AuthErrorParsed,
      SignUpPayload,
      unknown
    >,
    signOut: signOutMutation.mutate,
    signInStatus: signInMutation.status,
    signUpStatus: signUpMutation.status,
    signOutStatus: signOutMutation.status,
    parseAuthError,
  };
}
