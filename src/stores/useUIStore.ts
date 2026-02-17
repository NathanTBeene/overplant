import { create } from "zustand";

/* --------------------------------- ALERT --------------------------------- */

type AlertType = "yes-no-cancel" | "yes-no" | "ok" | "ok-cancel";
type AlertResponse<T extends AlertType> = T extends "yes-no-cancel"
  ? "yes" | "no" | "cancel"
  : T extends "yes-no"
  ? "yes" | "no"
  : T extends "ok"
  ? "ok"
  : T extends "ok-cancel"
  ? "ok" | "cancel"
  : never;

interface AlertOptions {
  title: string;
  description: string;
  type?: AlertType;
  required?: boolean;
}

interface AlertState {
  isOpen: boolean;
  title: string;
  description: string;
  type: AlertType;
  required: boolean;
  resolve: ((value: AlertResponse<AlertType>) => void) | null;
}

/* --------------------------------- MODAL --------------------------------- */

interface ModalOptions {
  title?: string;
  content?: React.ReactNode;
  showBackdrop?: boolean;
  showCloseButton?: boolean;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  showBackdrop: boolean;
  showCloseButton: boolean;
}

/* --------------------------------- STORE --------------------------------- */

interface UIState {
  alert: AlertState;
  modal: ModalState;

  showAlert: <T extends AlertType = "yes-no-cancel">(
    options: AlertOptions & { type?: T }
  ) => Promise<AlertResponse<T>>;
  respondAlert: (response: string) => void;

  openModal: (options?: ModalOptions) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  alert: {
    isOpen: false,
    title: "",
    description: "",
    type: "yes-no-cancel",
    required: false,
    resolve: null,
  },

  modal: {
    isOpen: false,
    title: "",
    content: null,
    showBackdrop: true,
    showCloseButton: true,
  },

  showAlert: (options) => {
    return new Promise((resolve) => {
      set({
        alert: {
          isOpen: true,
          title: options.title,
          description: options.description,
          type: options.type || "yes-no-cancel",
          required: options.required ?? false,
          resolve: resolve as (value: AlertResponse<AlertType>) => void,
        },
      });
    });
  },

  respondAlert: (response) => {
    const { alert } = get();
    alert.resolve?.(response as AlertResponse<AlertType>);
    set({ alert: { ...alert, isOpen: false, resolve: null } });
  },

  openModal: (options = {}) => {
    set({
      modal: {
        isOpen: true,
        title: options.title ?? "",
        content: options.content ?? null,
        showBackdrop: options.showBackdrop ?? true,
        showCloseButton: options.showCloseButton ?? true,
      },
    });
  },

  closeModal: () => {
    set((s) => ({ modal: { ...s.modal, isOpen: false } }));
  },
}));
