import React from 'react';

export const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 transition-shadow hover:shadow-soft ${className}`} {...props}>
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
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'black'; 
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}) => {
  // Airbnb style: Pill shaped, slightly larger padding, font-semibold
  const base = "px-6 py-3 rounded-full font-semibold text-sm transition-transform duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary hover:bg-rose-600 text-white shadow-sm border border-transparent", // Pink/Red Brand
    black: "bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-black shadow-sm", // Standard high contrast
    secondary: "bg-white border border-gray-900 text-gray-900 hover:bg-gray-50 dark:bg-transparent dark:border-white dark:text-white dark:hover:bg-white/10", // Outlined
    danger: "bg-white border border-red-500 text-red-500 hover:bg-red-50",
    ghost: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 border border-transparent",
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
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-4 py-3.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-xl text-base text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all shadow-sm"
    />
  </div>
);

export const Badge = ({ children, color = 'blue' }: { children?: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'black' }) => {
  // Softer pastel backgrounds, no borders
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    red: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    yellow: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    black: 'bg-gray-900 text-white dark:bg-white dark:text-black'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Added animation and rounded-2xl */}
      <div className="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-floating overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-card sticky top-0 z-10">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const Toast = ({ message, type = 'success', onClose }: any) => (
  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
    <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-floating flex items-center gap-3">
      <span className="text-sm font-semibold">{message}</span>
    </div>
  </div>
);