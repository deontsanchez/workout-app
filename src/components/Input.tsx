import React from 'react';

interface InputProps {
    type: string;
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder: string;
    className?: string;
    label: string;
}

const Input: React.FC<InputProps> = ({ type, value, onChange, placeholder, className, label }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'number') {
            const numberValue = parseFloat(event.target.value);
            if (!isNaN(numberValue)) {
                onChange(numberValue);
            }
        } else {
            onChange(event.target.value);
        }
    }

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input-field">{label}</label>
            <input type={type} value={value} onChange={handleChange} placeholder={placeholder} className={`border border-gray-300 px-3 py-2 rounded ${className}`} id="input-field" />
        </div>
    );
};

export default Input;