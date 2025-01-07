
import React from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function TextArea({ label, value, onChange, placeholder }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck="false"
        className="modern-input w-full min-h-[300px] sm:h-[500px] p-6 
                 text-gray-900 dark:text-gray-100
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 resize-none font-mono text-sm leading-relaxed
                 border border-[#141414] dark:border-transparent"
        style={{
          whiteSpace: 'pre',
          wordWrap: 'break-word',
          fontFamily: 'Open Sans, sans-serif',
          overflowWrap: 'break-word',
          unicodeBidi: 'embed',
          WebkitTextSizeAdjust: '100%'
        }}
      />
    </div>
  );
}
