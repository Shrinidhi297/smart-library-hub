import BookSearch from "@/components/BookSearch";
import UserDashboard from "@/components/UserDashboard";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, LayoutDashboard, ShieldCheck, ArrowRight, Search, BookOpen } from "lucide-react";
import { useSoundEffects } from "@/hooks/use-sound-effects";

const ADMIN_EMAIL = "sngangur123@gmail.com";

const Index = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const { playHover, playClick } = useSoundEffects();
  const [view, setView] = useState<'search' | 'dashboard'>('search');
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing Hub...</p>
        </div>
      </div>
    );
  }

  const handleAdminClick = async () => {
    playClick();
    if (!isAdmin) {
      await signOut();
      navigate("/sign-in");
    } else {
      setShowAdminConfirm(true);
    }
  };

  const confirmAdminAccess = () => {
    playClick();
    setView('search');
    setShowAdminConfirm(false);
  };

  const handleUserClick = () => {
    playClick();
    setView('dashboard');
  };

  const handleSearchClick = () => {
    playClick();
    setView('search');
  };

  const handleBrandClick = () => {
    playClick();
    setView('search');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary relative grid-bg">
      <AlertDialog open={showAdminConfirm} onOpenChange={setShowAdminConfirm}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-3xl p-10 bg-white/90 backdrop-blur-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black tracking-tighter text-slate-900">Elevate to Admin?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
              You are about to enter the high-level control sector. Detailed archival modifications and user management will be enabled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel
              className="h-16 rounded-[1.5rem] border-2 border-slate-100 font-black text-xs uppercase tracking-widest hover:bg-slate-50"
              onClick={() => playClick()}
            >
              Abort
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-16 rounded-[1.5rem] bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:shadow-primary/30"
              onClick={confirmAdminAccess}
            >
              Authorize Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>      {/* Background Decorative Auras */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* 3D Floating Book Props */}
        <div className="absolute top-[10%] right-[10%] w-[300px] md:w-[500px] opacity-40 animate-float pointer-events-none mix-blend-multiply flex items-center justify-center text-[20rem] font-black text-primary/5 select-none">
          BOOK
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="nav-nova">
          <div className="container mx-auto px-6 h-28 flex items-center justify-between">
            <div
              className="flex items-center gap-4 group cursor-pointer"
              onClick={handleBrandClick}
              onMouseEnter={playHover}
            >
              <div className="relative flex flex-col items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-700">
                <div className="w-14 h-14 rounded-[1.5rem] bg-primary flex items-center justify-center shadow-xl shadow-primary/30 ring-4 ring-white">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Smart</span>
                <span className="text-lg md:text-xl font-bold text-primary leading-tight">Library Hub</span>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-12">
              <SignedIn>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-3 font-black text-slate-900 hover:bg-slate-50 transition-all h-14 px-8 rounded-2xl text-xs uppercase tracking-widest border border-slate-100 bg-white/50 shadow-sm"
                      onMouseEnter={playHover}
                      onClick={playClick}
                    >
                      {isAdmin ? "Admin Console" : "Member Panel"}
                      <ChevronDown className="h-4 w-4 opacity-30" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 bg-white/90 backdrop-blur-3xl border-slate-100 p-3 rounded-[2rem] mt-4 shadow-2xl">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl p-5 hover:bg-primary/5 group gap-4"
                      onClick={handleSearchClick}
                      onMouseEnter={playHover}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Search className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                      </div>
                      <span className="font-black text-slate-900 uppercase text-xs tracking-widest">Search Archives</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl p-5 hover:bg-primary/5 group gap-4"
                      onClick={handleUserClick}
                      onMouseEnter={playHover}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <LayoutDashboard className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                      </div>
                      <span className="font-black text-slate-900 uppercase text-xs tracking-widest">User Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl p-5 hover:bg-primary/5 group gap-4"
                      onClick={handleAdminClick}
                      onMouseEnter={playHover}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ShieldCheck className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                      </div>
                      <span className="font-black text-slate-900 uppercase text-xs tracking-widest">Admin Control</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="pl-6 border-l border-slate-100">
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-12 w-12 shadow-2xl ring-4 ring-white" } }} />
                </div>
              </SignedIn>
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="hidden md:block hover:text-primary transition-all text-sm font-black text-slate-900 uppercase tracking-widest"
                  onMouseEnter={playHover}
                  onClick={playClick}
                >
                  Sign In
                </Link>
                <Link to="/sign-in">
                  <Button
                    className="btn-nova group"
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    Get Started <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </header>

        <main className="flex-grow pt-28">
          <SignedIn>
            <div className="animate-nova-in">
              {view === 'search' ? (
                <BookSearch onNavigateToDashboard={() => setView('dashboard')} />
              ) : (
                <UserDashboard onNavigateToSearch={() => setView('search')} />
              )}
            </div>
          </SignedIn>

          <SignedOut>
            <div className="container mx-auto px-6 py-24 md:py-48 flex flex-col items-center text-center">
              <div className="mb-12 p-2 rounded-full bg-primary/5 border border-primary/10 px-8 py-3 inline-flex items-center gap-4 animate-nova-in shadow-sm">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(67,56,202,0.5)]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Intelligence-Driven Archive</span>
              </div>

              <h2 className="text-5xl sm:text-7xl md:text-[9rem] font-black mb-12 leading-[0.85] tracking-tighter text-slate-900 animate-nova-in" style={{ animationDelay: '0.1s' }}>
                Master Your <br className="hidden sm:block" />
                <span className="shimmer-text italic">Digital Legacy</span>
              </h2>

              <p className="text-xl md:text-3xl text-slate-500 mb-16 md:mb-24 max-w-4xl mx-auto leading-tight animate-nova-in font-bold tracking-tight" style={{ animationDelay: '0.2s' }}>
                A high-performance neural hub for academic excellence.
                Experience the frontier of research management.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-nova-in" style={{ animationDelay: '0.3s' }}>
                <Link to="/sign-in" className="w-full sm:w-auto">
                  <Button
                    className="btn-nova w-full sm:w-auto h-20 px-16 text-xl shadow-2xl shadow-primary/40 group"
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    Enter the Vault <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Case Study Sections */}
              <div className="w-full mt-48 md:mt-80 space-y-48 md:space-y-96 pb-40">
                {/* UI Design Section */}
                <section id="ui-design" className="text-left animate-nova-in">
                  <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
                    <div>
                      <h3 className="text-primary font-black uppercase tracking-[0.3em] mb-8 text-xs md:text-sm">01 / Visual Identity</h3>
                      <h4 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter text-slate-900 leading-[0.85]">Neo-Lux <br />Core UI</h4>
                      <p className="text-slate-500 text-lg md:text-2xl leading-tight mb-12 font-bold max-w-xl">
                        A liquid-shadow aesthetic designed for hyper-focus. High-contrast typography paired with deep glassmorphism for ultimate clarity.
                      </p>
                      <div className="flex gap-6">
                        {['bg-primary', 'bg-accent', 'bg-slate-900', 'bg-white border-4 border-slate-50 shadow-2xl'].map(c => (
                          <div key={c} className={`w-16 h-16 md:w-24 md:h-24 rounded-[2rem] ${c} shadow-2xl hover:scale-110 -translate-y-2 transition-all duration-500`} />
                        ))}
                      </div>
                    </div>
                    <div className="relative aspect-square glass-panel p-16 flex flex-col justify-end group overflow-hidden border-4">
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="h-full flex flex-col items-center justify-center opacity-5 font-black text-[12rem] md:text-[20rem] pointer-events-none select-none">UX</div>
                      <div className="space-y-6 relative z-10">
                        <div className="h-4 w-full bg-primary/30 rounded-full" />
                        <div className="h-4 w-2/3 bg-slate-900/10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Library System Section */}
                <section id="library-system" className="text-left animate-nova-in">
                  <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
                    <div className="order-2 md:order-1 relative aspect-square glass-panel p-16 flex flex-col justify-center gap-10 group border-4 shadow-primary/5">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 w-full bg-white/50 border-2 border-slate-50 rounded-[2rem] flex items-center justify-between px-10 group-hover:bg-white group-hover:shadow-2xl transition-all transform hover:scale-[1.05] shadow-sm">
                          <div className="h-4 w-48 bg-slate-200 rounded-full" />
                          <div className="w-8 h-8 rounded-2xl bg-primary/20" />
                        </div>
                      ))}
                    </div>
                    <div className="order-1 md:order-2">
                      <h3 className="text-primary font-black uppercase tracking-[0.3em] mb-8 text-xs md:text-sm">02 / Architecture</h3>
                      <h4 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter text-slate-900 leading-[0.85]">Neural <br />Engine</h4>
                      <p className="text-slate-500 text-lg md:text-2xl leading-tight mb-12 font-bold max-w-xl">
                        Orchestrated by high-speed indexing and real-time archival state management. Zero friction. Total control.
                      </p>
                      <div className="grid grid-cols-2 gap-6">
                        {['CRYPTO_SECURE', 'LIVE_SYNC', 'NEURAL_SEARCH', 'CLOUD_VAULT'].map(tag => (
                          <div key={tag} className="flex items-center gap-4 text-[10px] md:text-xs font-black text-slate-900 bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-glow" /> {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Statistics Section */}
                <section id="user-research" className="text-center animate-nova-in">
                  <div className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] md:rounded-[6rem] p-24 md:p-48 text-white shadow-[0_80px_160px_-40px_rgba(0,0,0,0.4)] relative overflow-hidden ring-8 ring-white/10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-transparent" />
                    <h3 className="text-primary font-black uppercase tracking-[0.4em] mb-12 text-xs md:text-base relative z-10">03 / Reliability Matrix</h3>
                    <h4 className="text-7xl md:text-[14rem] font-black mb-12 italic relative z-10 tracking-tighter shimmer-text">99.9%</h4>
                    <p className="text-slate-400 text-sm md:text-2xl font-black uppercase tracking-[0.3em] relative z-10">System Precision Index</p>
                  </div>
                </section>
              </div>
            </div>
          </SignedOut>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 py-24 bg-white/40 backdrop-blur-3xl relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div
                className="flex items-center gap-5 group cursor-pointer"
                onClick={() => { playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onMouseEnter={playHover}
              >
                <div className="w-6 h-6 rounded-full bg-primary shadow-[0_0_20px_rgba(67,56,202,0.5)]" />
                <span className="text-3xl font-black text-slate-900 tracking-tighter italic shimmer-text">Smart Library Hub</span>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  © 2026 Smart Library Hub.
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                  Engineered for Digital Sovereignty.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
