'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

interface FormValues {
  email: string;
}

const RecoverPassword: React.FC = () => {
  const { handleSubmit, control } = useForm<FormValues>();
  const { requestPasswordReset, error } = useAuth();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await requestPasswordReset(data.email);
  };

  return (
    <div className='sm:w-full py-8 px-4 md:flex flex-col items-center'>
        <h1 className='text-2xl text-center font-bold'>Insira seu email cadastrado na plataforma</h1>
        <div className='sm:w-full md:w-1/3'>
            <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
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
            <FormButton type='submit'>Enviar</FormButton>
            {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    </div>
  );
};

export default RecoverPassword;
