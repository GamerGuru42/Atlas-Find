import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  const baseClasses = 'glass-card';
  const hoverClasses = hoverable ? 'cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`.trim()}>
      {children}
    </div>
  );
}
