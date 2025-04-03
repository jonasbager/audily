
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Bot, Lock, Users, Gauge } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simplify SOC 2 Compliance with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            AuditAI streamlines your SOC 2 audit preparation with AI-generated policies, 
            automated evidence collection, and intelligent compliance guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features that simplify compliance
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 card-shadow">
              <Bot className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Policy Generator</h3>
              <p className="text-muted-foreground">
                Generate customized SOC 2 policies with GPT-4, tailored to your organization's needs.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 card-shadow">
              <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-muted-foreground">
                Track compliance tasks with clear assignments, due dates, and AI-assisted guidance.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 card-shadow">
              <Lock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Evidence Collection</h3>
              <p className="text-muted-foreground">
                Upload and organize evidence files with AI categorization and control mapping.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to simplify your SOC 2 audit?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join companies using AuditAI to streamline compliance and reduce audit preparation time by 60%.
        </p>
        <Button asChild size="lg">
          <Link to="/auth">Start Your Free Trial</Link>
        </Button>
      </div>
      
      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-2">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">AuditAI</span>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="text-muted-foreground hover:text-foreground">About</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © 2025 AuditAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
