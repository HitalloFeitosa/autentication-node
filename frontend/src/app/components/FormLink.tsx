import React from 'react';
import Link from 'next/link';

interface LinkButtonProps {
  text: string;
  href: string;
}

const FormLink: React.FC<LinkButtonProps> = ({ text, href }) => {
  return (
    <div className='text-center mt-4'>
      <p className='text-sm text-gray-600'>
        {text}{' '}
        <Link className='text-blue-600 hover:underline text-base' href={href}>
          {href === '/registro' ? 'Criar uma conta' : 'Fazer login'}
        </Link>
      </p>
    </div>
  );
};

export default FormLink;
