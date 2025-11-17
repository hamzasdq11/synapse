import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, TrendingUp, Play } from "lucide-react";
import { Link } from "react-router-dom";
import hamzaProfile from "@/assets/hamza-profile.jpg";
const Landing = () => {
  return <div className="min-h-screen bg-background">
      {/* Academic Banner */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img src={hamzaProfile} alt="Mohammad Hamza Siddiqui" className="w-32 h-32 rounded-full object-cover border-2 border-primary/20" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-muted-foreground mb-2 text-xs">
                  Engineered in partial fulfilment of the requirements for the AI Assignment under the course Introduction to Marketing Management    
                </p>
                <h3 className="text-lg font-semibold mb-2">
                  Indian Institute of Management Ranchi
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-medium">Faculty:</span> Prof. Shweta Jha
                </p>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Mohammad Hamza Siddiqui</p>
                  <p className="text-muted-foreground">IPM29-24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                AI-Powered Negotiation Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Transform Ad Engagement with
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI-to-AI Negotiation
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Synapse enables Brand Agents to negotiate directly with Consumer Agents, 
              creating personalized offers that maximize acceptance and ROI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/app">
                <Button size="lg" className="text-lg px-8 shadow-glow hover:shadow-[0_0_30px_hsla(11,100%,60%,0.5)] transition-all">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[{
            icon: Zap,
            title: "Upload Your Offer",
            description: "Define your product, pricing, and data requirements. Our system creates intelligent Brand Agents."
          }, {
            icon: Users,
            title: "AI Agents Negotiate",
            description: "Consumer Agents with unique personas engage in real-time negotiations, considering privacy, value, and preferences."
          }, {
            icon: TrendingUp,
            title: "Optimize & Convert",
            description: "Gain insights from thousands of simulations. Maximize acceptance rates and customer lifetime value."
          }].map((step, i) => <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-16">Built for Modern Teams</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[{
            title: "Agencies",
            description: "Deliver data-driven campaign optimization for clients with predictive negotiation insights."
          }, {
            title: "D2C Brands",
            description: "Increase conversion rates by understanding customer objections before they happen."
          }, {
            title: "Enterprise",
            description: "Scale personalization across millions of consumers while maintaining privacy compliance."
          }].map((useCase, i) => <div key={i} className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all">
                <h3 className="mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6">Ready to Transform Your Campaigns?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading brands using AI-powered negotiation to increase acceptance rates and customer value.
          </p>
          <Link to="/app">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 Synapse. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;