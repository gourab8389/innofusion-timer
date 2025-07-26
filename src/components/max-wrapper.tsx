"use client"
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MaxWrapperProps {
  children: React.ReactNode;
  className?: string; 
  style?: React.CSSProperties; 
}

export const MaxWrapper = ({ children, className = '', style = {}, ...rest }: MaxWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn("w-full h-full !scroll-smooth overflow-x-hidden", className)} 
      style={{ ...style, scrollBehavior: 'smooth' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
