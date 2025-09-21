import { create } from "zustand";

interface DialogState {
  guestLinksMigrationToken: string | null;
  openGuestLinksMigration: boolean;
  openGuestLinksLoginActionDialogContainer: (token: string) => void;
  closeGuestLinksLoginActionDialogContainer: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  guestLinksMigrationToken: null,
  openGuestLinksMigration: false,
  openGuestLinksLoginActionDialogContainer: (token) =>
    set({ guestLinksMigrationToken: token, openGuestLinksMigration: true }),
  closeGuestLinksLoginActionDialogContainer: () =>
    set({ guestLinksMigrationToken: null, openGuestLinksMigration: false }),
}));
