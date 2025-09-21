import { create } from "zustand";

interface DialogState {
  guestLinksLoginActionToken: string | null;
  openGuestLinksLoginAction: boolean;
  openGuestLinksLoginActionDialogContainer: (token: string) => void;
  closeGuestLinksLoginActionDialogContainer: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  guestLinksLoginActionToken: null,
  openGuestLinksLoginAction: false,
  openGuestLinksLoginActionDialogContainer: (token: string) =>
    set({ guestLinksLoginActionToken: token, openGuestLinksLoginAction: true }),
  closeGuestLinksLoginActionDialogContainer: () =>
    set({ guestLinksLoginActionToken: null, openGuestLinksLoginAction: false }),
}));
