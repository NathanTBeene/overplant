import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useRef, useState } from "react";

interface ModalOptions {
  title?: string;
  content?: React.ReactNode;
  showBackdrop?: boolean;
  showCloseButton?: boolean;
}

interface ModalState extends Required<ModalOptions> {
  isOpen: boolean;
  resolve: ((value: unknown) => void) | null;
}

const defaultState: ModalState = {
  isOpen: false,
  title: "",
  content: null,
  showBackdrop: true,
  showCloseButton: true,
  resolve: null,
}

const useModal = () => {
  const [state, setState] = useState<ModalState>(defaultState)
  const contentRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback((options: ModalOptions = {}) => {
    setState({
      isOpen: true,
      title: options.title ?? '',
      content: options.content ?? null,
      showBackdrop: options.showBackdrop ?? true,
      showCloseButton: options.showCloseButton ?? true,
      resolve: null,
    });
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const ModalComponent = (
    <Dialog.Root open={state.isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 z-50 DialogOverlay ${
            state.showBackdrop ? "bg-black/50" : "bg-transparent"
          }`}
          onPointerDown={(e) => {
            if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
              closeModal();
            }
          }}
        />

        <Dialog.Content
          ref={contentRef}
          className="bg-background-secondary rounded-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 z-100 min-w-80 shadow-lg text-text DialogContent"
        >
          {state.showCloseButton && (
            <Dialog.Close asChild>
              <button
                className="absolute right-3 top-3 text-text hover:text-accent-hover transition-colors duration-200 hover:cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </Dialog.Close>
          )}

          <Dialog.Title className="text-xl font-bold mb-4">
            {state?.title}
          </Dialog.Title>

          <div>{state.content}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return { ModalComponent, openModal, closeModal };
};

export default useModal
