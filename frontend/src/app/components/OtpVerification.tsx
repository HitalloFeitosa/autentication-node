import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

interface OTPFormValues {
  otp: string;
}

const OTPVerification: React.FC = () => {
  const { handleSubmit, control } = useForm<OTPFormValues>();
  const { verifyOTP, error } = useAuth(); // Assuming you add a verifyOTP function in your hook

  const onSubmit: SubmitHandler<OTPFormValues> = async (data) => {
    await verifyOTP(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Digite seu código OTP"
        {...control.register('otp', {
          required: 'O código OTP é obrigatório',
          pattern: {
            value: /^[0-9]{6}$/,
            message: 'O código OTP deve ter 6 dígitos',
          },
        })}
      />
      <button type="submit">Verificar OTP</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default OTPVerification;
