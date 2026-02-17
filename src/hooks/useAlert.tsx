// hooks/useAlert.tsx
import { useState, useCallback } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

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

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  type: AlertType;
  resolve: ((value: AlertResponse<AlertType>) => void) | null;
}

interface AlertOptions {
  title: string;
  description: string;
  type?: AlertType;
}

export const useAlert = () => {
  const [dialogState, setDialogState] = useState<AlertDialogState>({
    isOpen: false,
    title: "",
    description: "",
    type: "yes-no-cancel",
    resolve: null,
  });

  const showAlert = useCallback(
    <T extends AlertType = "yes-no-cancel">(
      options: AlertOptions & { type?: T }
    ): Promise<AlertResponse<T>> => {
      return new Promise((resolve) => {
        setDialogState({
          isOpen: true,
          title: options.title,
          description: options.description,
          type: options.type || "yes-no-cancel",
          resolve: (response: string) => resolve(response as AlertResponse<T>),
        });
      });
    },
    []
  );

  const handleResponse = useCallback(
    (response: string) => {
      if (dialogState.resolve) {
        dialogState.resolve(response as AlertResponse<AlertType>);
      }
      setDialogState((prev) => ({ ...prev, isOpen: false }));
    },
    [dialogState]
  );

  const buttonBase = ({
    onClick,
    children,
    className,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      className={`px-6 py-1 cursor-pointer text-white text-sm rounded-sm hover:bg-fill-hover transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const renderButtons = () => {
    switch (dialogState.type) {
      case "ok":
        return (
          <AlertDialog.Action asChild>
            {buttonBase({
              onClick: () => handleResponse("ok"),
              children: "OK",
              className: "bg-accent hover:bg-accent-hover!",
            })}
          </AlertDialog.Action>
        );

      case "ok-cancel":
        return (
          <>
            <AlertDialog.Cancel asChild>
              {buttonBase({
                onClick: () => handleResponse("cancel"),
                children: "Cancel",
              })}
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              {buttonBase({
                onClick: () => handleResponse("ok"),
                children: "OK",
                className: "bg-accent hover:bg-accent-hover!",
              })}
            </AlertDialog.Action>
          </>
        );

      case "yes-no":
        return (
          <>
            {buttonBase({
              onClick: () => handleResponse("no"),
              children: "No",
              className: "bg-cancel hover:bg-cancel-hover!",
            })}
            <AlertDialog.Action asChild>
              {buttonBase({
                onClick: () => handleResponse("yes"),
                children: "Yes",
                className: "bg-confirm hover:bg-confirm-hover!",
              })}
            </AlertDialog.Action>
          </>
        );

      case "yes-no-cancel":
      default:
        return (
          <>
            <AlertDialog.Cancel asChild>
              {buttonBase({
                onClick: () => handleResponse("cancel"),
                children: "Cancel",
              })}
            </AlertDialog.Cancel>
            {buttonBase({
              onClick: () => handleResponse("no"),
              children: "No",
              className: "bg-cancel hover:bg-cancel-hover!",
            })}
            <AlertDialog.Action asChild>
              {buttonBase({
                onClick: () => handleResponse("yes"),
                children: "Yes",
                className: "bg-confirm hover:bg-confirm-hover!",
              })}
            </AlertDialog.Action>
          </>
        );
    }
  };

  const handleClickOutside = () => {
    if (dialogState.type !== "ok") {
      handleResponse("cancel");
    }
  };

  const AlertDialogComponent = (
    <AlertDialog.Root
      open={dialogState.isOpen}
      onOpenChange={(open) => {
        if (!open && dialogState.type !== "ok") {
          handleResponse("cancel");
        }
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 AlertOverlay"
          onClick={handleClickOutside}
        />
        <AlertDialog.Content className="bg-background-secondary rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 z-51 min-w-120 shadow-lg text-text">
          <AlertDialog.Title className="text-xl font-bold mb-4">
            {dialogState.title}
          </AlertDialog.Title>
          <AlertDialog.Description>
            {dialogState.description}
          </AlertDialog.Description>

          <div className="flex gap-4 justify-end mt-8">{renderButtons()}</div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );

  return {
    showAlert,
    AlertDialogComponent,
  };
};
