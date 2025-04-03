
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle2, 
  Bot, 
  Lock, 
  Gauge, 
  FileCheck, 
  Database, 
  FileText, 
  ArrowRight, 
  ChevronRight 
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Testimonial from '@/components/landing/Testimonial';
import FeatureHighlight from '@/components/landing/FeatureHighlight';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AuditAI</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Testimonials</a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Log In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-gradient">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span>SOC 2 Compliance Made Simple</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ace Your SOC 2 Audit with <span className="gradient-text">AI-Powered</span> Simplicity
            </h1>
            <p className="text-xl text-muted-foreground mb-8 md:px-10">
              AuditAI streamlines your SOC 2 audit preparation with AI-generated policies, 
              automated evidence collection, and intelligent compliance guidance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth">Request a Demo</Link>
              </Button>
            </div>

            <div className="mt-12 md:mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-12 bottom-0 top-auto"></div>
              <div className="rounded-xl overflow-hidden border border-border shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200" 
                  alt="AuditAI Dashboard" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="border-y border-border bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-muted-foreground">
            <p className="text-sm font-medium">Trusted by innovative companies:</p>
            <span className="text-lg font-semibold opacity-70">Acme Inc</span>
            <span className="text-lg font-semibold opacity-70">TechFlow</span>
            <span className="text-lg font-semibold opacity-70">Quantum Systems</span>
            <span className="text-lg font-semibold opacity-70">FutureWorks</span>
            <span className="text-lg font-semibold opacity-70">DevSecOps</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Features that simplify compliance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes SOC 2 compliance accessible with powerful features designed for efficiency.
            </p>
          </div>

          <FeatureHighlight 
            title="AI-Powered Policy Generation"
            description="Generate customized SOC 2 policies with GPT-4, tailored to your organization's specific needs and requirements."
            icon={FileText}
            imageUrl="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
          />
          
          <FeatureHighlight 
            title="Intelligent Task Management"
            description="Track compliance tasks with clear assignments, due dates, and AI-assisted guidance for a streamlined audit process."
            icon={CheckCircle2}
            imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
            reversed={true}
          />
          
          <FeatureHighlight 
            title="Smart Evidence Collection"
            description="Upload and organize evidence files with AI categorization and control mapping, making audit preparation a breeze."
            icon={Lock}
            imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
          />
          
          <FeatureHighlight 
            title="Seamless System Integrations"
            description="Connect with the tools you already use - Google Workspace, AWS, GitHub, and more - to automatically gather compliance evidence."
            icon={Database}
            imageUrl="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
            reversed={true}
          />
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What our customers say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join these companies that have simplified their SOC 2 compliance journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              quote="AuditAI cut our SOC 2 preparation time in half. The AI-generated policies were spot on and saved us countless hours."
              author="Sarah Johnson"
              role="CTO"
              company="TechFlow"
            />
            <Testimonial
              quote="The evidence collection and task management features made our audit process seamless. Highly recommended for any compliance team."
              author="Michael Chen"
              role="Security Lead"
              company="Quantum Systems"
            />
            <Testimonial
              quote="I was skeptical about using AI for compliance, but AuditAI exceeded all expectations. Our auditor was impressed with our documentation."
              author="Emily Rodriguez"
              role="Compliance Manager"
              company="FutureWorks"
            />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How AuditAI Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, four-step process to SOC 2 compliance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Onboarding</h3>
              <p className="text-muted-foreground">Answer a few questions about your organization to customize your compliance journey.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Policies</h3>
              <p className="text-muted-foreground">Our AI creates tailored policies based on your specific business needs and requirements.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collect Evidence</h3>
              <p className="text-muted-foreground">Upload and organize evidence with smart categorization and control mapping.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ace Your Audit</h3>
              <p className="text-muted-foreground">Present your well-organized evidence and policies to auditors with confidence.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to simplify your SOC 2 audit?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join companies using AuditAI to streamline compliance and reduce audit preparation time by 60%.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth">
                Start Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Schedule a Demo</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Pricing Section (Simple version) */}
      <div id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your organization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-border rounded-xl p-8 bg-card flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Startup</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$199</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for small companies just starting their compliance journey.</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>AI Policy Generation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Task Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Basic Evidence Collection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Up to 5 users</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
            
            <div className="border-2 border-primary rounded-xl p-8 bg-card relative flex flex-col shadow-lg">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">Business</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$499</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">Ideal for growing companies with more complex compliance needs.</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Everything in Startup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Advanced Evidence Collection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>3 System Integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Up to 15 users</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Priority Support</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
            
            <div className="border border-border rounded-xl p-8 bg-card flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">Custom</span>
              </div>
              <p className="text-muted-foreground mb-6">For large organizations with custom compliance requirements.</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Everything in Business</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Unlimited Integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Custom Branding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Dedicated Success Manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Custom Integrations</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">AuditAI</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Simplifying SOC 2 compliance with AI-powered tools and guidance.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Integrations</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Compliance Guide</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">SOC 2 Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 AuditAI. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-1-4.8 4-8.9 8-5 1.6-1 3-2.2 4-4z"></path></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
