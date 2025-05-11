
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">SubmitSolveHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button className="gradient-bg" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Sharpen Your <span className="gradient-text">Coding Skills</span> with Real Challenges
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join our platform to tackle curated coding problems, submit solutions,
                and get better at algorithms and data structures. Perfect for interview prep.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="gradient-bg" onClick={() => navigate("/signup")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://placehold.co/600x400/e2e8f0/1e293b?text=Code+Challenges" 
                alt="Coding Challenges" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="challenge-card">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Choose a Challenge</h3>
                  <p className="text-muted-foreground">
                    Browse through our collection of coding problems ranging from easy to hard.
                  </p>
                </CardContent>
              </Card>
              <Card className="challenge-card">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Write Your Solution</h3>
                  <p className="text-muted-foreground">
                    Use our integrated code editor to write and test your solution in your preferred language.
                  </p>
                </CardContent>
              </Card>
              <Card className="challenge-card">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Submit for Review</h3>
                  <p className="text-muted-foreground">
                    Submit your solution for our team to review and provide feedback on your approach.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Solving?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create an account today and begin your journey to becoming a better programmer through practice.
            </p>
            <Button size="lg" className="gradient-bg" onClick={() => navigate("/signup")}>
              Sign Up Now
            </Button>
          </section>
        </main>

        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>© 2023 SubmitSolveHub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
