'use client';

import { redirect } from 'next/navigation';


const AppFirst = () => {

  return (
    redirect('/auth/login')
  );
};

export default AppFirst;
