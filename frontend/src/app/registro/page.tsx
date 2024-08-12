'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { handleSubmit, control, getValues, setError } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.text();
      console.log('Success:', result);

    } catch (error) {
      console.error('Error:', error);

      setError('email', { type: 'manual', message: 'Failed to register. Please try again.' });
    }
  };

  return (
    <div className='sm:w-full py-8 px-4'>
        <h1 className='text-xl text-center font-bold'>Cria conta</h1>
        <div className='sm:w-full'>
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
                required: 'Email is required',
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
                rules={{ required: 'O campo senha é obrigatório' }}
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
            <FormButton type='submit'>Criar conta</FormButton>
            </form>
        </div>
    </div>
  );
};

export default Register;
