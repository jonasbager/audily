
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
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-2">
              <img 
                src="/lovable-uploads/95193392-ed89-4477-91a6-fed54f7f67e5.png" 
                alt="AuditAI Logo" 
                className="h-7 w-7 object-contain"
              />
            </div>
            <span className="font-semibold text-xl text-white">AuditAI</span>
          </Link>
          
          {/* ... rest of left side */}
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-2">
                <img 
                  src="/lovable-uploads/95193392-ed89-4477-91a6-fed54f7f67e5.png" 
                  alt="AuditAI Logo" 
                  className="h-7 w-7 object-contain"
                />
              </div>
              <span className="font-semibold text-xl">AuditAI</span>
            </Link>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
