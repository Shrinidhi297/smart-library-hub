import BookSearch from "@/components/BookSearch";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "sngangur123@gmail.com";

const Index = () => {
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-xl">📚</span>
              </div>
              <h1 className="font-serif text-2xl font-bold">Smart Library Hub</h1>
            </div>

            <div className="flex items-center gap-4">
              <SignedIn>
                <div className="text-sm mr-2">
                  <span className="text-primary-foreground/80 hidden md:inline">
                    {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                  </span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      <main>
        <SignedIn>
          <BookSearch />
        </SignedIn>

        <SignedOut>
          <div className="container mx-auto px-4 py-24 text-center">
            <h2 className="text-4xl font-bold mb-6">Welcome to Smart Library Hub</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Please sign in to access your personal dashboard and manage your library collection.
            </p>
            <Link to="/sign-in">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </SignedOut>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 mt-12 fixed bottom-0 w-full z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2026 Smart Library Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
