'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import FormLink from '../components/FormLink';
import { useRouter } from 'next/navigation'

interface FormValues {
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { handleSubmit, control, getValues, setError } = useForm<FormValues>();
  const router = useRouter()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
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

      router.push('/')
    } catch (error) {
      console.error('Error:', error);

      setError('email', { type: 'manual', message: 'Failed to register. Please try again.' });
    }
  };

  return (
    <div className='sm:w-full py-8 px-4 md:flex flex-col items-center'>
        <h1 className='text-2xl text-center font-bold'>Fazer login</h1>
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
            <FormInput
                name="password"
                control={control}
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                rules={{ required: 'O campo senha é obrigatório' }}
            />
            <FormButton type='submit'>Entrar</FormButton>
            <FormLink
              text="Ainda não possui uma conta?"
              href="/registro"
            />
            </form>
        </div>
    </div>
  );
};

export default Register;
