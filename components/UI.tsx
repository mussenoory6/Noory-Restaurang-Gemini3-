import React from 'react';

export const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm rounded-xl p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  fullWidth = false 
}: { 
  children?: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; 
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}) => {
  const base = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-dark-card dark:border-dark-border dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", value, onChange, placeholder, className = "" }: any) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition-all"
    />
  </div>
);

export const Badge = ({ children, color = 'blue' }: { children?: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    gray: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-dark-border flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
          <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            ✕
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const Toast = ({ message, type = 'success', onClose }: any) => (
  <div className="fixed bottom-6 right-6 animate-slide-up z-50">
    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
);