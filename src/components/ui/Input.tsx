import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500',
              'px-4 py-2.5 text-sm',
              'transition-all duration-200',
              'focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:bg-slate-800',
              'hover:border-slate-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30' : '',
              leftIcon ? 'pl-10' : '',
              rightElement ? 'pr-10' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 flex items-center">{rightElement}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
