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
import { ChevronDown, LayoutDashboard, ShieldCheck, ArrowRight } from "lucide-react";
import { useSoundEffects } from "@/hooks/use-sound-effects";

const ADMIN_EMAIL = "sngangur123@gmail.com";

const Index = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const { playHover, playClick } = useSoundEffects();

  const handleAdminClick = async () => {
    playClick();
    if (!isAdmin) {
      await signOut();
      navigate("/sign-in");
    }
  };

  const handleUserClick = async () => {
    playClick();
    await signOut();
    navigate("/sign-up");
  };

  const handleBrandClick = () => {
    playClick();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary relative grid-bg">
      {/* Background Decorative Auras */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* 3D Floating Book Props */}
        <img
          src="/3d-books.png"
          alt="3D Books"
          className="absolute top-[10%] right-[10%] w-[300px] md:w-[500px] opacity-40 animate-float pointer-events-none mix-blend-multiply"
          style={{ animationDuration: '10s' }}
        />
        <img
          src="/3d-books.png"
          alt="3D Books"
          className="absolute bottom-[20%] left-[5%] w-[200px] md:w-[350px] opacity-30 animate-float pointer-events-none mix-blend-multiply scale-x-[-1]"
          style={{ animationDuration: '15s', animationDelay: '-5s' }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="nav-nova">
          <div className="container mx-auto px-6 h-24 flex items-center justify-between">
            <div
              className="flex items-center gap-2 md:gap-4 group cursor-pointer"
              onClick={handleBrandClick}
              onMouseEnter={playHover}
            >
              <div className="relative flex flex-col items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-500">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                  <div className="w-4 h-4 md:w-5 md:h-5 border-b-4 border-r-4 border-white rotate-45 -translate-y-0.5 md:-translate-y-1" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-slate-900 leading-none">Smart</span>
                <span className="text-lg md:text-xl font-bold text-primary leading-none">Library Hub</span>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              <SignedIn>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 md:gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl text-xs md:text-base"
                      onMouseEnter={playHover}
                      onClick={playClick}
                    >
                      {isAdmin ? "Admin" : "Panel"}
                      <ChevronDown className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 md:w-64 bg-white/95 backdrop-blur-2xl border-slate-100 p-2 rounded-2xl mt-4 shadow-2xl">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl p-3 md:p-4 hover:bg-slate-50 group"
                      onClick={handleUserClick}
                      onMouseEnter={playHover}
                    >
                      <LayoutDashboard className="mr-3 h-3.5 w-3.5 md:h-4.5 md:w-4.5 text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="font-bold text-slate-900">User Panel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl p-3 md:p-4 hover:bg-slate-50 group"
                      onClick={handleAdminClick}
                      onMouseEnter={playHover}
                    >
                      <ShieldCheck className="mr-3 h-3.5 w-3.5 md:h-4.5 md:w-4.5 text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="font-bold text-slate-900">Admin Panel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="pl-4 md:pl-6 border-l border-slate-100">
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9 md:h-11 md:w-11 shadow-md ring-2 ring-white" } }} />
                </div>
              </SignedIn>
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="hidden md:block hover:text-primary transition-all text-sm font-bold text-slate-600"
                  onMouseEnter={playHover}
                  onClick={playClick}
                >
                  Sign In
                </Link>
                <Link to="/sign-in">
                  <Button
                    className="btn-nova h-10 md:h-12 px-5 md:px-8 rounded-xl md:rounded-2xl text-sm md:text-base font-bold"
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <SignedIn>
            <div className="container mx-auto px-6 py-16 animate-nova-in">
              <BookSearch />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="container mx-auto px-6 py-20 md:py-40 flex flex-col items-center text-center">
              <div className="mb-8 md:mb-10 p-2 rounded-full bg-primary/5 border border-primary/10 px-6 md:px-8 py-2 md:py-3 inline-flex items-center gap-3 animate-nova-in">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">AI-Powered Research</span>
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-[7rem] font-extrabold mb-8 md:mb-12 leading-[1.1] md:leading-[1] tracking-tight text-slate-900 animate-nova-in" style={{ animationDelay: '0.1s' }}>
                Build Your Digital <br className="hidden sm:block" />
                <span className="text-primary italic">Library Future</span>
              </h2>

              <p className="text-lg md:text-2xl text-slate-500 mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed animate-nova-in font-medium" style={{ animationDelay: '0.2s' }}>
                All your academic materials managed in one high-performance interface.
                Experience a lightning-fast library tool designed for modern researchers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 animate-nova-in" style={{ animationDelay: '0.3s' }}>
                <Link to="/sign-in" className="w-full sm:w-auto">
                  <Button
                    className="btn-nova w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 text-base md:text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/25"
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    Launch Hub <ArrowRight className="ml-3 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
              </div>

              {/* Case Study Sections */}
              <div className="w-full mt-24 md:mt-60 space-y-32 md:space-y-60 pb-20 md:pb-40">
                {/* UI Design Section */}
                <section id="ui-design" className="text-left animate-nova-in">
                  <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div>
                      <h3 className="text-primary font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 text-[10px] md:text-sm">01 / Visual Identity</h3>
                      <h4 className="text-4xl md:text-7xl font-extrabold mb-6 md:mb-10 tracking-tight text-slate-900 leading-[1] md:leading-[0.9]">Premium <br className="hidden sm:block" />UX Flow</h4>
                      <p className="text-slate-500 text-base md:text-xl leading-relaxed mb-8 md:mb-12 font-medium max-w-xl">
                        A clean, indigo-driven aesthetic designed for cognitive clarity. High-performance layouts with zero distraction for ultimate research efficiency.
                      </p>
                      <div className="flex gap-4 md:gap-6">
                        {['bg-primary', 'bg-accent', 'bg-slate-900', 'bg-white border border-slate-100'].map(c => (
                          <div key={c} className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${c} shadow-xl hover:scale-110 transition-all duration-300`} />
                        ))}
                      </div>
                    </div>
                    <div className="relative aspect-square bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-50 p-8 md:p-12 flex flex-col justify-end group overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="h-full flex flex-col items-center justify-center opacity-10 font-black text-[8rem] md:text-[12rem] pointer-events-none">UI</div>
                      <div className="space-y-3 md:space-y-4 relative z-10">
                        <div className="h-1.5 md:h-2 w-full bg-primary/20 rounded-full" />
                        <div className="h-1.5 md:h-2 w-2/3 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Library System Section */}
                <section id="library-system" className="text-left animate-nova-in">
                  <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="order-2 md:order-1 relative aspect-square bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-50 p-10 md:p-16 flex flex-col justify-center gap-6 md:gap-8 group">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 md:h-16 w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-between px-6 md:px-10 group-hover:bg-white transition-all transform hover:scale-[1.05]">
                          <div className="h-2 md:h-3 w-24 md:w-40 bg-slate-200 rounded-full" />
                          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/20" />
                        </div>
                      ))}
                    </div>
                    <div className="order-1 md:order-2">
                      <h3 className="text-primary font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 text-[10px] md:text-sm">02 / Architecture</h3>
                      <h4 className="text-4xl md:text-7xl font-extrabold mb-6 md:mb-10 tracking-tight text-slate-900 leading-[1] md:leading-[0.9]">System <br className="hidden sm:block" />Engine</h4>
                      <p className="text-slate-500 text-base md:text-xl leading-relaxed mb-8 md:mb-12 font-medium max-w-xl">
                        Powered by ultra-fast indexing and real-time state management. Experience zero-latency archival interactions.
                      </p>
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {['Cloud Active', 'No-Latency', 'Secure Crypt', 'Live Sync'].map(tag => (
                          <div key={tag} className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-slate-600 bg-slate-50 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" /> {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Statistics Section */}
                <section id="user-research" className="text-center animate-nova-in">
                  <div className="max-w-4xl mx-auto bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-24 text-white shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent" />
                    <h3 className="text-primary font-bold uppercase tracking-[0.2em] mb-6 md:mb-10 text-[10px] md:text-sm relative z-10">03 / Performance Matrix</h3>
                    <h4 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 italic relative z-10">99.9%</h4>
                    <p className="text-slate-400 text-sm md:text-xl font-medium uppercase tracking-widest relative z-10">Record Precision Rate</p>
                  </div>
                </section>
              </div>
            </div>
          </SignedOut>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 py-16 bg-white/50 backdrop-blur-3xl relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => { playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onMouseEnter={playHover}
              >
                <div className="w-4 h-4 rounded-full bg-primary" />
                <span className="text-2xl font-black text-slate-900 italic">Smart Library Hub</span>
              </div>
              <p className="text-sm font-medium text-slate-400">
                © 2026 Smart Library Hub. Dedicated to Digital Excellence.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
