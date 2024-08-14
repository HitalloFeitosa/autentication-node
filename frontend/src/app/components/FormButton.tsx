'use client'

import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../public/animation.json';
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type = 'button', className = '', onClick, children, isLoading }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <button
      type={type}
      className={`bg-black h-14 rounded-md mt-6 text-white hover:bg-slate-600 transition-colors duration-300 ease-in-out ${className} flex items-center justify-center`}
      onClick={onClick}
      disabled={isLoading}
    >
    {isLoading ? <Lottie options={defaultOptions} height={80} width={80} /> : children}
    </button>
  );
};
  
export default Button;