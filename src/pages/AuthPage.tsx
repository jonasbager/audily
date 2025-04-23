
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-muted p-0">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center">
            <img 
              src="/audily_logo.svg" 
              alt="Audily Logo" 
              className="h-10 object-contain"
            />
          </Link>
          
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Audily</h2>
            <p className="text-white text-lg">
              Your AI-powered solution for streamlined audit and compliance processes.
            </p>
          </div>
          <div>
            <p className="text-white text-sm">© 2024 Audily. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center justify-center">
              <img 
                src="/audily_logo.svg" 
                alt="Audily Logo" 
                className="h-10 object-contain"
              />
            </Link>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
