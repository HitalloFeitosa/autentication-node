'use client'

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import FormLink from '../components/FormLink';
import OTPVerification from '../components/OtpVerification'; // Import OTP Component
import { useAuth } from '../hooks/useAuth';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { handleSubmit, control, getValues, setError } = useForm<FormValues>();
  const { register, error, showOtpField } = useAuth();
  
  const [isRegistered, setIsRegistered] = useState(false); // Track registration status
  const [email, setEmail] = useState(""); // Store registered email

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'As senhas digitadas não coincidem',
      });
      return;
    }
    const response = await register(data);
    if(response) {
      setIsRegistered(true);
      setEmail(data.email);
    }
  };

  return (
    <div className='sm:w-full py-8 px-4 md:flex flex-col items-center'>
      <div className='sm:w-full md:w-1/3'>
        {!showOtpField ? (
          <>
            <h1 className='text-2xl text-center font-bold'>Criar Conta</h1>

            <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                name="name"
                control={control}
                label="Nome"
                placeholder="Digite seu nome"
                rules={{ required: 'O campo nome é obrigatório' }}
              />
              <FormInput
                name="email"
                control={control}
                label="Email"
                type="email"
                placeholder="Digite seu email"
                rules={{
                  required: 'O campo email é obrigatório',
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: 'Email inválido',
                  },
                }}
              />
              <FormInput
                name="password"
                control={control}
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                rules={{
                  required: 'O campo senha é obrigatório',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.',
                  },
                }}
              />
              <FormInput
                name="confirmPassword"
                control={control}
                label="Confirmar Senha"
                type="password"
                placeholder="Confirme sua senha"
                rules={{
                  required: 'Confirme sua senha',
                  validate: (value: string) =>
                    value === getValues('password') || 'As senhas digitadas não coincidem',
                }}
              />
              <FormButton type='submit'>Criar Conta</FormButton>
              {error && <p className="text-red-500">{error}</p>}
              <FormLink
                text="Já possui uma conta?"
                href="/login"
              />
            </form>
          </>
        ) : (
          <>
            <h1 className='text-2xl text-center font-bold'>Digite o código recebido por email</h1>
            <OTPVerification email={email} />
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
