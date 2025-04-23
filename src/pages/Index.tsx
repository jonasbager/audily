
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
            <Link to="/">
              <img 
                src="/audily_logo.svg" 
                alt="Audily Logo" 
                className="h-14 object-contain"
              />
            </Link>
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
              <span>AI powered audit</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Accelerate Your <span className="gradient-text">NIS2 & SOX</span> Compliance Journey
            </h1>
            <p className="text-xl text-muted-foreground mb-8 md:px-10">
              Audily streamlines your regulatory compliance with AI-generated policies, 
              automated evidence collection, and intelligent guidance for NIS2 and SOX requirements.
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
                  alt="Audily Dashboard" 
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
      <div id="features" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Features that simplify compliance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes NIS2 and SOX compliance accessible with powerful features designed for efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="feature-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Policy Generation</h3>
              <p className="text-muted-foreground">Generate customized NIS2 and SOX policies with GPT-4, tailored to your organization's specific requirements.</p>
            </div>

            <div className="feature-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Task Management</h3>
              <p className="text-muted-foreground">Track compliance tasks with clear assignments, due dates, and AI-assisted guidance for a streamlined audit process.</p>
            </div>

            <div className="feature-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Evidence Collection</h3>
              <p className="text-muted-foreground">Upload and organize evidence files with AI categorization and requirement mapping for NIS2 and SOX frameworks.</p>
            </div>

            <div className="feature-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless System Integrations</h3>
              <p className="text-muted-foreground">Connect with the tools you already use to automatically gather compliance evidence for both regulatory frameworks.</p>
            </div>
          </div>
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
              Join these companies that have simplified their regulatory compliance journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              quote="Audily cut our NIS2 preparation time in half. The AI-generated policies were spot on and saved us countless hours."
              author="Sarah Johnson"
              role="CTO"
              company="TechFlow"
            />
            <Testimonial
              quote="The evidence collection and task management features made our SOX audit process seamless. Highly recommended for any compliance team."
              author="Michael Chen"
              role="Security Lead"
              company="Quantum Systems"
            />
            <Testimonial
              quote="I was skeptical about using AI for compliance, but Audily exceeded all expectations. Our auditor was impressed with our documentation."
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
              A simple, four-step process to NIS2 and SOX compliance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Onboarding</h3>
              <p className="text-muted-foreground">Select your compliance framework (NIS2 or SOX) and answer a few questions about your organization.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Policies</h3>
              <p className="text-muted-foreground">Our AI creates tailored policies based on your specific framework requirements and business needs.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collect Evidence</h3>
              <p className="text-muted-foreground">Upload and organize evidence with smart categorization and requirement mapping for your chosen framework.</p>
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
            Ready to simplify your compliance journey?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join companies using AuditAI to streamline NIS2 and SOX compliance and reduce audit preparation time by 60%.
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
      
      {/* Book a Demo */}
      <div id="book-demo" className="py-16 md:py-24 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See AuditAI in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Get a personalized walkthrough of how AuditAI can streamline your NIS2 and SOX compliance process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/book-demo">
                Book a Free Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="mailto:sales@auditai.com">
                Contact Sales
              </a>
            </Button>
          </div>
          <div className="mt-12 text-muted-foreground space-y-2">
            <p>✓ No credit card required</p>
            <p>✓ 30-minute personalized consultation</p>
            <p>✓ Tailored to your compliance needs</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16">
                  <img 
                    src="/audily_logo.svg" 
                    alt="Audily Logo" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Simplifying NIS2 and SOX compliance with AI-powered tools and guidance.
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
                <li><a href="#" className="text-muted-foreground hover:text-foreground">NIS2 & SOX Templates</a></li>
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
              © 2025 Audily. All rights reserved.
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
