import { SignUp } from '@clerk/nextjs';
import React from 'react'

const SignUpPage = async ({searchParams}: {searchParams: {redirect_url?: string}}) => {
    const params = await searchParams;
    const redirectUrl = params.redirect_url || '/dashboard';
  return (
    <div className=' flex py-10 min-h-screen justify-center items-center bg-linear-to-r from-gray-50 to-gray-100'>
      <SignUp
      appearance={{
        elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-xl",
        }
      }}
      signInUrl='/sign-in'
      afterSignInUrl={redirectUrl}
      redirectUrl={redirectUrl}

      />
    </div>
  )
}

export default SignUpPage
