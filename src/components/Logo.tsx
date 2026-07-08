import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={`${sizeClasses[size]} gradient-primary rounded-lg flex items-center justify-center shadow-elegant`}>
        <Calendar className="text-primary-foreground" size={size === 'lg' ? 28 : size === 'md' ? 22 : 18} />
      </div>
      {showText && (
        <span className={`font-display font-bold text-primary ${textSizeClasses[size]}`}>
          Escaleluia
        </span>
      )}
    </div>
  );
}
