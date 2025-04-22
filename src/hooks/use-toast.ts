import { useState, useEffect } from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToastActionElement = React.ReactNode;

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

type State = {
  toasts: ToastProps[];
};

export const useToast = () => {
  const [state, setState] = useState<State>({
    toasts: [],
  });

  const toast = (props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setState((state) => ({
      ...state,
      toasts: [{ id, ...props }, ...state.toasts.slice(0, TOAST_LIMIT - 1)],
    }));
    return id;
  };

  const dismiss = (toastId?: string) => {
    setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => {
        return t.id !== toastId;
      }),
    }));
  };

  const update = (toastId: string, props: Partial<ToastProps>) => {
    if (!toastId) return;
    setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) => {
        if (t.id === toastId) {
          return { ...t, ...props };
        }
        return t;
      }),
    }));
  };

  useEffect(() => {
    const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

    state.toasts.forEach((toast) => {
      if (!timeouts.has(toast.id)) {
        const timeout = setTimeout(() => {
          dismiss(toast.id);
          timeouts.delete(toast.id);
        }, TOAST_REMOVE_DELAY);

        timeouts.set(toast.id, timeout);
      }
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [state.toasts]);

  return {
    toasts: state.toasts,
    toast,
    dismiss,
    update,
  };
};

export type Toast = ReturnType<typeof useToast>;
