import React from 'react';
import { CheckCircleIcon, AlertCircleIcon, AlertTriangleIcon, InfoIcon, CloseIcon } from './NotificationIcons';

const ALERT_CONFIGS = {
  success: {
    bg: 'bg-[#F2F7EE]',
    border: 'border-[#D2E3C8]',
    text: 'text-[#244026]',
    icon: <CheckCircleIcon className="w-5 h-5 text-[#2F5233] shrink-0" />,
  },
  error: {
    bg: 'bg-[#FDF4F5]',
    border: 'border-[#F1D0D5]',
    text: 'text-[#6D1B27]',
    icon: <AlertCircleIcon className="w-5 h-5 text-[#A63446] shrink-0" />,
  },
  warning: {
    bg: 'bg-[#FDF8EE]',
    border: 'border-[#F4DEC0]',
    text: 'text-[#7A4B13]',
    icon: <AlertTriangleIcon className="w-5 h-5 text-[#C87D2A] shrink-0" />,
  },
  info: {
    bg: 'bg-[#F2F7FA]',
    border: 'border-[#D0E2EE]',
    text: 'text-[#1E435E]',
    icon: <InfoIcon className="w-5 h-5 text-[#3D6B8C] shrink-0" />,
  },
};

export default function InlineAlert({
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  title,
  description,
  children,
  action, // { label: string, onClick: () => void }
  onClose,
  className = '',
}) {
  const config = ALERT_CONFIGS[type] || ALERT_CONFIGS.info;

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 flex items-start gap-3 text-sm font-dm-sans transition-all ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <div className="pt-0.5">{config.icon}</div>

      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm leading-tight mb-1">{title}</h4>}
        {description && <div className="text-xs sm:text-sm leading-relaxed opacity-95">{description}</div>}
        {children && <div className="text-xs sm:text-sm leading-relaxed mt-1 opacity-95">{children}</div>}

        {action && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={action.onClick}
              className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-current rounded"
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 p-1 -mr-1 -mt-1 rounded-md transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Dismiss alert"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
