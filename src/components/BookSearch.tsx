import React, { useState } from "react";
import { Search, BookOpen, X, SlidersHorizontal, SortAsc, User, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdminRenewalPanel } from "./AdminRenewalPanel";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available_copies: number;
  total_copies: number;
  cover_url?: string;
  description?: string;
}

interface RenewalRequest {
  id: number;
  bookTitle: string;
  userName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ADMIN_EMAIL = "sngangur123@gmail.com";

interface BookSearchProps {
  onNavigateToDashboard?: () => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onNavigateToDashboard }) => {
  const { user, isLoaded } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const { playHover, playClick } = useSoundEffects();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [sortType, setSortType] = useState<"title" | "author">("title");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    total_copies: 1,
    cover_url: "",
  });

  // Fetch books from Supabase
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', searchQuery],
    queryFn: async () => {
      let query = supabase.from('books').select('*');

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order(sortType, { ascending: true });
      if (error) throw error;
      return data as Book[];
    }
  });

  // Reservation Mutation
  const reserveMutation = useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Authentication required");

      // 0. Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.fullName || user.username || 'Anonymous',
          avatar_url: user.imageUrl,
          updated_at: new Date().toISOString()
        });

      if (profileError) console.error("Profile sync failed:", profileError);

      // 1. Create reservation
      const { error: resError } = await supabase
        .from('reservations')
        .insert({
          user_id: user.id,
          book_id: bookId,
          status: 'pending',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        });

      if (resError) throw resError;

      // 2. Decrement available copies
      const book = books.find(b => b.id === bookId);
      if (book) {
        const { error: updateError } = await supabase
          .from('books')
          .update({ available_copies: Math.max(0, book.available_copies - 1) })
          .eq('id', bookId);
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success("Reservation sequence initiated", {
        description: "Your request is being processed by the archive."
      });
    },
    onError: (error: any) => {
      toast.error("Security Breach: ACCESS_DENIED", {
        description: error.message || "Failed to complete reservation."
      });
    }
  });

  // Add Book Mutation
  const addBookMutation = useMutation({
    mutationFn: async (book: typeof newBook) => {
      const { error } = await supabase
        .from('books')
        .insert([{
          ...book,
          available_copies: book.total_copies
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setNewBook({ title: "", author: "", category: "", total_copies: 1, cover_url: "" });
      toast.success("Record Committed", {
        description: "Library catalog has been updated."
      });
    },
    onError: (error: any) => {
      toast.error("Manifest Error", { description: error.message });
    }
  });

  // Delete Book Mutation
  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success("Record Neutralized", { description: "Asset removed from archives." });
    },
    onError: (error: any) => {
      toast.error("Cleanup Error", { description: error.message });
    }
  });

  const handleSearch = () => {
    playClick();
    setHasSearched(!!searchQuery);
  };

  const clearSearch = () => {
    playClick();
    setSearchQuery("");
    setHasSearched(false);
  };

  const handleReserve = (id: string) => {
    playClick();
    if (!user) {
      toast.error("Identity Verification Failed", {
        description: "Please sign in to access the vault."
      });
      return;
    }
    reserveMutation.mutate(id);
  };

  const handleBookClick = (book: Book) => {
    playClick();
    const query = `${book.title} ${book.author}`;
    window.open(`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 md:space-y-32 px-4 md:px-0 bg-background/50">
      {/* Brand Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16 animate-nova-in" id="search">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] md:text-xs font-black mb-4 md:mb-10 gap-2 border border-primary/10">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            {isAdmin ? "ADMIN_COMMAND_CENTER" : "VIRTUAL_ARCHIVE_ACTIVE"}
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-4 md:mb-10 leading-[1.1] py-2">
            {isAdmin ? "Advanced" : "Explore the"} <br />
            <span className={`${isAdmin ? 'bg-gradient-to-r from-emerald-600 to-teal-500' : 'shimmer-text'} italic bg-clip-text text-transparent lg:pr-12`}>
              {isAdmin ? "Archive Control" : "Digital Vault"}
            </span>
          </h2>
          <p className="text-slate-500 font-bold text-base md:text-xl max-w-lg leading-relaxed mx-auto lg:mx-0">
            {isAdmin ? "Unified administration node for multispectral asset management and catalog curation." : "Access our high-performance collection of peer-reviewed records and intellectual assets."}
          </p>
        </div>

        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`w-full md:w-auto rounded-2xl md:rounded-[2rem] border-slate-200 hover:border-primary/50 bg-white/70 backdrop-blur-xl text-slate-900 font-black h-16 md:h-20 px-8 md:px-12 transition-all shadow-xl hover:shadow-2xl ${isAdmin ? 'ring-2 ring-emerald-100' : ''}`}
                onMouseEnter={playHover}
              >
                FILTERS <SlidersHorizontal className={`ml-4 h-5 w-5 opacity-40 ${isAdmin ? 'text-emerald-500' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/90 backdrop-blur-3xl border-slate-100 p-3 rounded-[2rem] mt-4 shadow-3xl">
              <div className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sort Criteria</div>
              <DropdownMenuItem
                className="cursor-pointer rounded-xl p-4 hover:bg-primary/5 group gap-4"
                onClick={() => setSortType("title")}
                onMouseEnter={playHover}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10"><SortAsc className={`h-4 w-4 text-slate-400 group-hover:text-primary ${isAdmin ? 'group-hover:text-emerald-500' : ''}`} /></div>
                <span className={`font-black uppercase text-xs ${sortType === 'title' ? (isAdmin ? 'text-emerald-600' : 'text-primary') : 'text-slate-900'}`}>Title</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-xl p-4 hover:bg-primary/5 group gap-4"
                onClick={() => setSortType("author")}
                onMouseEnter={playHover}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10"><User className={`h-4 w-4 text-slate-400 group-hover:text-primary ${isAdmin ? 'group-hover:text-emerald-500' : ''}`} /></div>
                <span className={`font-black uppercase text-xs ${sortType === 'author' ? (isAdmin ? 'text-emerald-600' : 'text-primary') : 'text-slate-900'}`}>Author</span>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>      {/* Admin Panel */}
      {isAdmin && (
        <div className="animate-nova-in" style={{ animationDelay: '100ms' }}>
          <div className="glass-panel p-10 md:p-16 relative overflow-hidden group border-emerald-100 border-2">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50 group-hover:opacity-100 transition-opacity" />

            <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4 relative z-10">
              <div className="w-3 h-10 bg-emerald-500 rounded-full" />
              Manifest Asset <span className="text-emerald-600 italic">Registration</span>
            </h3>

            <form
              onSubmit={(e) => { e.preventDefault(); addBookMutation.mutate(newBook); }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10"
            >
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Book Title</Label>
                <Input
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="The Pragmatic Programmer"
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Author / Entity</Label>
                <Input
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="Andrew Hunt"
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Category</Label>
                <Input
                  required
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  placeholder="Technology"
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Total Inventory</Label>
                <Input
                  type="number"
                  required
                  value={newBook.total_copies}
                  onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })}
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="flex justify-end md:col-span-2">
                <Button
                  type="submit"
                  disabled={addBookMutation.isPending}
                  className="h-16 md:h-20 px-12 rounded-2xl md:rounded-[2rem] w-full md:w-auto text-base bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1"
                  onMouseEnter={playHover}
                >
                  <Plus className="mr-3 h-6 w-6" />
                  {addBookMutation.isPending ? 'Committing...' : 'Commit Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panels */}
      {isAdmin && (
        <AdminRenewalPanel />
      )}

      {/* Search Bar */}
      <div className="relative animate-nova-in" style={{ animationDelay: '200ms' }}>
        <div className={`absolute inset-0 ${isAdmin ? 'bg-emerald-500/10' : 'bg-primary/10'} blur-[100px] rounded-[5rem] -z-10 transition-colors duration-700`} />
        <Search className={`absolute left-6 md:left-12 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:${isAdmin ? 'text-emerald-500' : 'text-primary'} transition-colors`} />
        <Input
          placeholder="QUERY ARCHIVE..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={`h-20 md:h-32 pl-14 md:pl-28 pr-32 md:pr-64 bg-white shadow-2xl focus:shadow-[0_40px_100px_-20px_rgba(${isAdmin ? '16,185,129' : '67,56,202'},0.15)] rounded-2xl md:rounded-[3.5rem] text-lg md:text-3xl font-black text-slate-900 transition-all focus:ring-[15px] md:focus:ring-[20px] focus:ring-${isAdmin ? 'emerald' : 'primary'}/5 border-white border-2 md:border-4`}
        />
        <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-6">
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={clearSearch}
              className="h-10 w-10 md:h-16 md:w-16 rounded-full p-0 hover:bg-slate-50 transition-colors hidden sm:flex"
              onMouseEnter={playHover}
            >
              <X className="h-5 w-5 text-slate-400" />
            </Button>
          )}
          <Button
            onClick={handleSearch}
            className={`${isAdmin ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'btn-nova'} h-12 md:h-20 px-6 md:px-16 rounded-xl md:rounded-[2.5rem] text-[10px] md:text-lg uppercase tracking-widest font-black text-white shadow-2xl transition-all`}
            onMouseEnter={playHover}
          >
            Execute
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 animate-nova-in pb-40" style={{ animationDelay: '300ms' }}>
        {books.map((book, idx) => (
          <div
            key={book.id}
            className="group card-3d relative"
            style={{ animationDelay: `${idx * 50}ms` }}
            onMouseEnter={playHover}
          >
            <div className="p-6 md:p-10 h-full flex flex-col justify-between relative bg-white border border-white rounded-[2rem] md:rounded-[3rem] shadow-2xl hover:shadow-primary/10 transition-all duration-700 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />

              <div className="flex justify-between items-start mb-12">
                <div className={`w-20 h-20 rounded-[1.75rem] border-2 border-slate-50 flex items-center justify-center transition-all duration-500 shadow-xl bg-slate-50/50 ${isAdmin ? 'group-hover:bg-emerald-500 group-hover:shadow-emerald-200' : 'group-hover:bg-primary group-hover:shadow-primary/40'} group-hover:text-white`}>
                  <BookOpen className="h-8 w-8" />
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">#{book.id.slice(0, 4)}</span>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${book.available_copies > 0 ? 'bg-green-100/50 text-green-600 border border-green-200' : 'bg-red-100/50 text-red-600 border border-red-200'}`}>
                    {book.available_copies > 0 ? 'Available' : 'Out of Stock'}
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`text-3xl font-black tracking-tighter text-slate-900 leading-[1] mb-4 transition-colors ${isAdmin ? 'group-hover:text-emerald-600' : 'group-hover:text-primary'}`}>
                  {book.title}
                </h4>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.15em] mb-12">
                  {book.author}
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pt-8 border-t border-slate-50/50">
                    <span className="px-5 py-2.5 bg-slate-50 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 shadow-sm">
                      {book.category || 'General'}
                    </span>
                    <div className="flex gap-4">
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-12 w-12 rounded-2xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                              onMouseEnter={playHover}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2.5rem] border-none shadow-3xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black text-slate-900">Remove Book?</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 font-bold">
                                Are you sure you want to remove <span className="text-slate-900 font-black">{book.title}</span> from the archives? This will also remove any active reservations for this book.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest">Keep It</AlertDialogCancel>
                              <AlertDialogAction
                                className="rounded-2xl h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest"
                                onClick={() => deleteBookMutation.mutate(book.id)}
                              >
                                Yes, Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-14 w-14 rounded-2xl border-slate-100 text-slate-400 bg-white shadow-xl transition-all ${isAdmin ? 'hover:border-emerald-500 hover:text-emerald-500 hover:shadow-emerald-100' : 'hover:border-primary/50 hover:text-primary hover:shadow-primary/10'}`}
                        onClick={(e) => { e.stopPropagation(); handleBookClick(book); }}
                        onMouseEnter={playHover}
                      >
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      onClick={() => handleReserve(book.id)}
                      disabled={book.available_copies === 0 || reserveMutation.isPending}
                      className={`w-full bg-slate-900 text-white font-black h-14 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl ${isAdmin ? 'hover:bg-emerald-600 hover:shadow-emerald-200' : 'hover:bg-primary hover:shadow-primary/30'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {reserveMutation.isPending ? 'Processing...' : 'Reserve Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(books.length === 0 && !isLoading) && (
          <div className="col-span-full py-60 text-center glass-panel border-dashed group">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-colors">
              <Search className="h-10 w-10 text-slate-300 group-hover:text-primary transition-all" />
            </div>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">Archive Empty</h3>
            <p className="text-slate-400 font-bold text-lg mt-4 uppercase tracking-[0.2em]">Awaiting records or refine query</p>
          </div>
        )}
        {isLoading && (
          <div className="col-span-full py-60 text-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-slate-400 font-black uppercase tracking-widest">Accessing Vault...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
