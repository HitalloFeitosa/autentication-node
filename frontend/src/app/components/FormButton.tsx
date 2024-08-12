'use client'

import React from 'react';
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = 'button', className = '', onClick, children }) => {
    return (
      <button
        type={type}
        className={`bg-black h-14 rounded-md mt-6 text-white hover:bg-slate-600 transition-colors duration-300 ease-in-out ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
};
  
export default Button;