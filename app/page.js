"use client"

import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(()=>{
    // redirect('/api/auth/login?post_login_redirect_url=/dashboard')
    redirect('/api/auth/login?post_login_redirect_url=/dashboard/add-subject');

  })
  return (
    <div>
      {/* <h1>Hello world</h1>
      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink> */}
    </div>
  )
    
}

