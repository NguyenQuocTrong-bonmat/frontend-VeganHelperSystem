import { useContext } from 'react';
import toast from 'react-hot-toast';
import { NotificationContext } from '../context/NotificationContext';

const defaultFallbackContext = {
  notify: {
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
  },
  confirm: async (options = {}) => {
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      return window.confirm(options.description || options.title || 'Are you sure?');
    }
    return true;
  },
  toast,
};

export function useNotification() {
  const context = useContext(NotificationContext);
  return context || defaultFallbackContext;
}

export default useNotification;
