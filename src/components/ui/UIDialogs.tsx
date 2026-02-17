import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRef } from "react";
import { useUIStore } from "@/stores/useUIStore";

/* --------------------------------- ALERT --------------------------------- */

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

const AlertButtons = () => {
  const type = useUIStore((s) => s.alert.type);
  const respondAlert = useUIStore((s) => s.respondAlert);

  switch (type) {
    case "ok":
      return (
        <AlertDialogPrimitive.Action asChild>
          {buttonBase({
            onClick: () => respondAlert("ok"),
            children: "OK",
            className: "bg-accent hover:bg-accent-hover!",
          })}
        </AlertDialogPrimitive.Action>
      );

    case "ok-cancel":
      return (
        <>
          <AlertDialogPrimitive.Cancel asChild>
            {buttonBase({
              onClick: () => respondAlert("cancel"),
              children: "Cancel",
            })}
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action asChild>
            {buttonBase({
              onClick: () => respondAlert("ok"),
              children: "OK",
              className: "bg-accent hover:bg-accent-hover!",
            })}
          </AlertDialogPrimitive.Action>
        </>
      );

    case "yes-no":
      return (
        <>
          {buttonBase({
            onClick: () => respondAlert("no"),
            children: "No",
            className: "bg-cancel hover:bg-cancel-hover!",
          })}
          <AlertDialogPrimitive.Action asChild>
            {buttonBase({
              onClick: () => respondAlert("yes"),
              children: "Yes",
              className: "bg-confirm hover:bg-confirm-hover!",
            })}
          </AlertDialogPrimitive.Action>
        </>
      );

    case "yes-no-cancel":
    default:
      return (
        <>
          <AlertDialogPrimitive.Cancel asChild>
            {buttonBase({
              onClick: () => respondAlert("cancel"),
              children: "Cancel",
            })}
          </AlertDialogPrimitive.Cancel>
          {buttonBase({
            onClick: () => respondAlert("no"),
            children: "No",
            className: "bg-cancel hover:bg-cancel-hover!",
          })}
          <AlertDialogPrimitive.Action asChild>
            {buttonBase({
              onClick: () => respondAlert("yes"),
              children: "Yes",
              className: "bg-confirm hover:bg-confirm-hover!",
            })}
          </AlertDialogPrimitive.Action>
        </>
      );
  }
};

const AlertDialogUI = () => {
  const alert = useUIStore((s) => s.alert);
  const respondAlert = useUIStore((s) => s.respondAlert);

  const handleClickOutside = () => {
    if (alert.required) return;
    if (alert.type === "ok") {
      respondAlert("ok");
    } else {
      respondAlert("cancel");
    }
  };

  return (
    <AlertDialogPrimitive.Root
      open={alert.isOpen}
      onOpenChange={(open) => {
        if (!open && alert.type !== "ok") {
          respondAlert("cancel");
        }
      }}
    >
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay
          className="bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 AlertOverlay"
          onClick={handleClickOutside}
        />
        <AlertDialogPrimitive.Content className="bg-background-secondary rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 z-51 min-w-120 shadow-lg text-text">
          <AlertDialogPrimitive.Title className="text-xl font-bold mb-4">
            {alert.title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description>
            {alert.description}
          </AlertDialogPrimitive.Description>
          <div className="flex gap-4 justify-end mt-8">
            <AlertButtons />
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
};

/* --------------------------------- MODAL --------------------------------- */

const ModalDialogUI = () => {
  const modal = useUIStore((s) => s.modal);
  const closeModal = useUIStore((s) => s.closeModal);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <DialogPrimitive.Root open={modal.isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={`fixed inset-0 z-50 DialogOverlay ${
            modal.showBackdrop ? "bg-black/50" : "bg-transparent"
          }`}
          onPointerDown={(e) => {
            if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
              closeModal();
            }
          }}
        />
        <DialogPrimitive.Content
          ref={contentRef}
          className="bg-background-secondary rounded-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 z-100 min-w-80 shadow-lg text-text DialogContent"
        >
          {modal.showCloseButton && (
            <DialogPrimitive.Close asChild>
              <button
                className="absolute right-3 top-3 text-text hover:text-accent-hover transition-colors duration-200 hover:cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </DialogPrimitive.Close>
          )}
          <DialogPrimitive.Title className="text-xl font-bold mb-4">
            {modal.title}
          </DialogPrimitive.Title>
          <div>{modal.content}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

/* -------------------------------- COMBINED ------------------------------- */

const UIDialogs = () => (
  <>
    <AlertDialogUI />
    <ModalDialogUI />
  </>
);

export default UIDialogs;
