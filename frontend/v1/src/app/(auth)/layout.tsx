"use client"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";



const SignInPage = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
 
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "https://checkche-backend.onrender.com/auth/google";
  };

    return (
      <div className="flex justify-center items-center h-full">
    <Button 
      onClick={handleGoogleLogin}
      disabled={!isClient}
      >
        <FcGoogle/> Continue with Google
      </Button>
  

      {children}
    </div>
  )
}

export default SignInPage