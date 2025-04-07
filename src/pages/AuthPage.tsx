
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || 'login';
  
  return (
    <div className="min-h-screen flex bg-muted p-0">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-2">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-xl text-white">AuditAI</span>
          </Link>
          
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-white mb-6">Simplify your SOC 2 audit journey</h2>
            <p className="text-primary-foreground/80 text-lg">
              Join hundreds of companies using AuditAI to streamline compliance and reduce audit preparation time by 60%.
            </p>
          </div>
        </div>
        
        <div className="text-primary-foreground/60 text-sm">
          © 2025 AuditAI. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-2">
                <Shield className="h-5 w-5 text-primary-foreground" />
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
