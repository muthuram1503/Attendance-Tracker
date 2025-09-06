'use client'

import React from 'react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import Image from 'next/image';

function Header() {
  const { user } = useKindeBrowserClient(); // ✅ Extract `user` correctly

  return (
    <div className='p-4 shadow-sm border flex justify-between'>
      <div></div>
      
      <div>
        {user?.picture ? (
          <Image 
            src={user.picture} 
            width={35} 
            height={35} 
            alt="profile" 
            className="rounded-full" 
            unoptimized // Use this if Next.js optimization is causing issues
          />
        ) : (
          <div className="w-[35px] h-[35px] bg-gray-300 rounded-full" />
        )}
      </div>
    </div>
  );
}

export default Header;

