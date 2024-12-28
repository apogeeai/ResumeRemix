
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
        className="w-full min-h-[300px] sm:h-[500px] p-4 rounded-lg border border-gray-300 dark:border-gray-700 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 resize-none shadow-sm whitespace-pre-wrap font-mono"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      />
    </div>
  );
}
