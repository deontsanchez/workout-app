import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  label?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  className,
  label
}) => {
  const isOptionObject = (option: string | Option): option is Option => {
    return typeof option !== 'string' && 'value' in option && 'label' in option && option.hasOwnProperty('value') && option.hasOwnProperty('label');
  };

  return (
    <div className={className ? className : ''}>
        {label && <label className="block mb-1">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-gray-300 px-3 py-2 rounded w-full`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;