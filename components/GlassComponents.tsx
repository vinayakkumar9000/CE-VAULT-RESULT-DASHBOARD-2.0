import React from 'react';

export const GlassCard = ({ children, className = '', onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer hover:bg-white/10 hover:scale-[1.01]' : ''} ${className}`}
  >
    {children}
  </div>
);

export const GlassButton = ({ children, onClick, className = '', variant = 'primary', disabled = false }: { children?: React.ReactNode, onClick?: () => void, className?: string, variant?: 'primary' | 'secondary' | 'danger', disabled?: boolean }) => {
    const baseStyles = "px-6 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-blue-600/80 hover:bg-blue-500/90 text-white shadow-lg shadow-blue-500/20",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
        danger: "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30"
    };
    
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export const GlassInput = ({ value, onChange, placeholder, type = "text", className = '' }: any) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`glass-input w-full px-4 py-3 rounded-xl placeholder-gray-400 text-white ${className}`}
    />
);

export const Badge = ({ type, text }: { type: 'pass' | 'fail' | 'carry' | 'distinction' | 'info', text: string }) => {
    const colors = {
        pass: 'bg-green-500/20 text-green-300 border-green-500/30',
        fail: 'bg-red-500/20 text-red-300 border-red-500/30',
        carry: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        distinction: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        info: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[type]}`}>
            {text}
        </span>
    );
};