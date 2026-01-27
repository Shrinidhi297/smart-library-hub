import BookSearch from "@/components/BookSearch";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutDashboard, ShieldCheck } from "lucide-react";

const ADMIN_EMAIL = "sngangur123@gmail.com";

const Index = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const handleAdminClick = async () => {
    if (!isAdmin) {
      // If not admin, sign out and redirect to login to allow admin login
      await signOut();
      navigate("/sign-in");
    }
  };

  const handleUserClick = async () => {
    // If clicking User Dashboard, user wants to switch to a user account
    // Sign out and redirect to sign-up/sign-in
    await signOut();
    navigate("/sign-up");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground shadow-xl sticky top-0 z-50 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center shadow-lg glow-effect">
                <span className="text-secondary-foreground font-bold text-2xl">📚</span>
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight">Smart Library Hub</h1>
                <p className="text-primary-foreground/60 text-xs hidden sm:block">Your Digital Knowledge Gateway</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SignedIn>
                <div className="mr-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2 rounded-xl border border-primary-foreground/20 px-4"
                      >
                        {isAdmin ? (
                          <>
                            <ShieldCheck className="h-4 w-4 text-secondary" />
                            <span className="hidden sm:inline">Admin Dashboard</span>
                          </>
                        ) : (
                          <>
                            <LayoutDashboard className="h-4 w-4 text-secondary" />
                            <span className="hidden sm:inline">User Dashboard</span>
                          </>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-lg border-border/50 shadow-xl rounded-xl">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted rounded-lg mx-1 my-0.5" onClick={handleUserClick}>
                        <LayoutDashboard className="mr-3 h-4 w-4 text-secondary" />
                        <span>User Dashboard / Sign Up</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted rounded-lg mx-1 my-0.5" onClick={handleAdminClick}>
                        <ShieldCheck className="mr-3 h-4 w-4 text-secondary" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in">
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl shadow-lg font-semibold px-6">
                    Sign In
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-24">
        <SignedIn>
          <BookSearch />
        </SignedIn>

        <SignedOut>
          <div className="relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 py-32 text-center relative">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                Welcome to the Future of Libraries
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-serif text-foreground leading-tight">
                Smart Library <span className="gradient-text">Hub</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Your gateway to a world of knowledge. Access thousands of books, manage your reading journey, and discover AI-powered recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sign-in">
                  <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-2xl border-2 border-primary/20 hover:bg-primary/5">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </SignedOut>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground py-8 fixed bottom-0 w-full z-10 border-t border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <span className="font-serif font-semibold">Smart Library Hub</span>
            </div>
            <p className="text-sm text-primary-foreground/60">
              © 2026 Smart Library Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
