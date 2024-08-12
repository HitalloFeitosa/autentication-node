import React from 'react';
import { useController, Control } from 'react-hook-form';

interface FormInputProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  placeholder?: string;
  rules?: any;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  rules,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: '',
  });

  return (
    <div className="form-group flex flex-col">
      <label className='mt-3 mb-2' htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...field}
        className={`h-14 border rounded-md pl-5 text-slate-700 focus:outline-none transition-colors duration-200 placeholder:text-slate-400 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-slate-900 focus:border-slate-300'
        }`}
      />
      {error && <p className="error-message mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default FormInput;
