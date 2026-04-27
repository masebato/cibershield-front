import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, leftIcon, className = '', id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none z-10">
              {leftIcon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            className={[
              'w-full rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 outline-none',
              'px-4 py-2.5 text-sm appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:bg-slate-800',
              'hover:border-slate-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30' : '',
              leftIcon ? 'pl-10' : '',
              className,
            ].join(' ')}
            {...props}
          >
            {children}
          </select>
          {/* Icono de flecha para el select */}
          <div className="absolute right-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;  