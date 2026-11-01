import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
    isLoading: false,
  });

  const confirmResolverRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmState({
        isOpen: true,
        title: options.title || 'Confirm Action',
        description: options.description || 'Are you sure you want to proceed?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'danger',
        isLoading: false,
      });
    });
  }, []);

  const handleConfirmAction = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    if (confirmResolverRef.current) {
      confirmResolverRef.current(true);
      confirmResolverRef.current = null;
    }
  }, []);

  const handleCancelAction = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    if (confirmResolverRef.current) {
      confirmResolverRef.current(false);
      confirmResolverRef.current = null;
    }
  }, []);

  // Standard notify object wrapping toast
  const notify = {
    success: (message, description, options) => {
      const content = description ? `${message} — ${description}` : message;
      return toast.success(content, options);
    },
    error: (message, description, options) => {
      const content = description ? `${message} — ${description}` : message;
      return toast.error(content, options);
    },
    warning: (message, description, options) => {
      const content = description ? `${message} — ${description}` : message;
      return toast(content, { icon: '⚠️', ...options });
    },
    info: (message, description, options) => {
      const content = description ? `${message} — ${description}` : message;
      return toast(content, { icon: 'ℹ️', ...options });
    },
    loading: (message, options) => toast.loading(message, options),
    dismiss: (toastId) => toast.dismiss(toastId),
  };

  const contextValue = {
    confirm,
    notify,
    toast,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        isLoading={confirmState.isLoading}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </NotificationContext.Provider>
  );
}
