import React, { useState, useEffect } from "react";
import { Search, BookOpen, X, Plus, Trash2, SlidersHorizontal, ArrowRight, SortAsc, Calendar, User, CheckCircle, XCircle, Clock } from "lucide-react";
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

interface Book {
  id: number;
  title: string;
  author: string;
  year: string;
  status: 'available' | 'reserved' | 'borrowed';
  ebookUrl?: string;
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
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const { playHover, playClick } = useSoundEffects();

  const [renewalRequests, setRenewalRequests] = useState<RenewalRequest[]>([
    { id: 1, bookTitle: "Atomic Habits", userName: "Shrinidhi Gangur", requestDate: "2024-02-12", status: 'pending' },
    { id: 2, bookTitle: "Deep Work", userName: "OP Panda", requestDate: "2024-02-11", status: 'pending' },
  ]);

  const [books, setBooks] = useState<Book[]>(() => {
    // ... rest of the code stays similar
    try {
      const saved = localStorage.getItem("library_books");
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);

      // Pre-published highly demanded books
      return [
        { id: 1, title: "Atomic Habits", author: "James Clear", year: "2018", status: 'available', ebookUrl: "https://example.com/atomic-habits" },
        { id: 2, title: "The Psychology of Money", author: "Morgan Housel", year: "2020", status: 'available', ebookUrl: "https://example.com/psychology-money" },
        { id: 3, title: "Deep Work", author: "Cal Newport", year: "2016", status: 'reserved' },
        { id: 4, title: "Zero to One", author: "Peter Thiel", year: "2014", status: 'available', ebookUrl: "https://example.com/zero-to-one" },
        { id: 5, title: "The Alchemist", author: "Paulo Coelho", year: "1988", status: 'borrowed' },
        { id: 6, title: "Sapiens", author: "Yuval Noah Harari", year: "2011", status: 'available' },
      ];
    } catch (error) {
      console.error("Failed to parse books from localStorage", error);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortType, setSortType] = useState<"title" | "author" | "year">("title");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
    status: 'available' as 'available' | 'reserved' | 'borrowed',
    ebookUrl: "",
  });

  useEffect(() => {
    localStorage.setItem("library_books", JSON.stringify(books));
  }, [books]);

  const sortBooks = (type: "title" | "author" | "year") => {
    playClick();
    setSortType(type);
    const sorted = [...books].sort((a, b) => {
      if (type === "year") return b.year.localeCompare(a.year);
      return a[type].localeCompare(b[type]);
    });
    setBooks(sorted);

    if (hasSearched) {
      const sortedResults = [...searchResults].sort((a, b) => {
        if (type === "year") return b.year.localeCompare(a.year);
        return a[type].localeCompare(b[type]);
      });
      setSearchResults(sortedResults);
    }
  };

  const handleSearch = () => {
    playClick();
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      if (sortType === "year") return b.year.localeCompare(a.year);
      return a[sortType].localeCompare(b[sortType]);
    });
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => {
    playClick();
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (!newBook.title || !newBook.author || !newBook.year) {
      alert("Please fill in all fields");
      return;
    }

    const book: Book = {
      id: Date.now(),
      title: newBook.title,
      author: newBook.author,
      year: newBook.year,
      status: newBook.status,
      ebookUrl: newBook.ebookUrl || undefined,
    };

    setBooks([...books, book]);
    setNewBook({ title: "", author: "", year: "", status: 'available', ebookUrl: "" });
  };

  const handleReserve = (id: number) => {
    playClick();
    if (!user) {
      alert("Please sign in to reserve books");
      return;
    }
    setBooks(books.map(book =>
      book.id === id ? { ...book, status: 'reserved' } : book
    ));
    if (hasSearched) {
      setSearchResults(searchResults.map(book =>
        book.id === id ? { ...book, status: 'reserved' } : book
      ));
    }
  };

  const handleAccessEbook = (url: string) => {
    playClick();
    window.open(url, "_blank");
  };

  const handleDeleteBook = (id: number) => {
    playClick();
    setBooks(books.filter((book) => book.id !== id));
    if (hasSearched) {
      setSearchResults(searchResults.filter((book) => book.id !== id));
    }
  };

  const handleBookClick = (book: Book) => {
    playClick();
    const query = `${book.title} ${book.author}`;
    window.open(`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 md:space-y-32 px-4 md:px-0 bg-background/50">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-16 animate-nova-in" id="search">
        <div className="max-w-2xl">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] md:text-xs font-black mb-6 md:mb-10 gap-2 border border-primary/10">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            {isAdmin ? "ADMIN_COMMAND_CENTER" : "VIRTUAL_ARCHIVE_ACTIVE"}
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-slate-900 mb-6 md:mb-10 leading-[0.85]">
            {isAdmin ? "Advanced" : "Explore the"} <br />
            <span className={`${isAdmin ? 'bg-gradient-to-r from-emerald-600 to-teal-500' : 'shimmer-text'} italic bg-clip-text text-transparent`}>
              {isAdmin ? "Archive Control" : "Digital Vault"}
            </span>
          </h2>
          <p className="text-slate-500 font-bold text-lg md:text-xl max-w-lg leading-relaxed">
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
                onClick={() => sortBooks("title")}
                onMouseEnter={playHover}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10"><SortAsc className={`h-4 w-4 text-slate-400 group-hover:text-primary ${isAdmin ? 'group-hover:text-emerald-500' : ''}`} /></div>
                <span className={`font-black uppercase text-xs ${sortType === 'title' ? (isAdmin ? 'text-emerald-600' : 'text-primary') : 'text-slate-900'}`}>Title</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-xl p-4 hover:bg-primary/5 group gap-4"
                onClick={() => sortBooks("author")}
                onMouseEnter={playHover}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10"><User className={`h-4 w-4 text-slate-400 group-hover:text-primary ${isAdmin ? 'group-hover:text-emerald-500' : ''}`} /></div>
                <span className={`font-black uppercase text-xs ${sortType === 'author' ? (isAdmin ? 'text-emerald-600' : 'text-primary') : 'text-slate-900'}`}>Author</span>
              </DropdownMenuItem>

              <div className="h-px bg-slate-100 my-2" />
              <div className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Status</div>
              {['available', 'reserved', 'borrowed'].map((status) => (
                <DropdownMenuItem
                  key={status}
                  className="cursor-pointer rounded-xl p-4 hover:bg-primary/5 group gap-4"
                  onClick={() => {
                    playClick();
                    const filtered = books.filter(b => b.status === status);
                    setSearchResults(filtered);
                    setHasSearched(true);
                  }}
                  onMouseEnter={playHover}
                >
                  <div className={`w-3 h-3 rounded-full ${status === 'available' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                    status === 'reserved' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                      'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    }`} />
                  <span className="font-black text-slate-900 capitalize text-xs">{status}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <div className="animate-nova-in" style={{ animationDelay: '100ms' }}>
          <div className="glass-panel p-10 md:p-16 relative overflow-hidden group border-emerald-100 border-2">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50 group-hover:opacity-100 transition-opacity" />

            <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4 relative z-10">
              <div className="w-3 h-10 bg-emerald-500 rounded-full" />
              Manifest Asset <span className="text-emerald-600 italic">Registration</span>
            </h3>

            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Book Title</Label>
                <Input
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="CRYPTO_RECORDS_2024"
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Author / Entity</Label>
                <Input
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="S. NAKAMOTO"
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Publication Era</Label>
                <Input
                  required
                  value={newBook.year}
                  onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                  placeholder="2024"
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">E-book URL (Optional)</Label>
                <Input
                  value={newBook.ebookUrl}
                  onChange={(e) => setNewBook({ ...newBook, ebookUrl: e.target.value })}
                  placeholder="https://example.com/ebook"
                  className="bg-white/50 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 border-2"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Status</Label>
                <select
                  value={newBook.status}
                  onChange={(e) => setNewBook({ ...newBook, status: e.target.value as any })}
                  className="w-full bg-white/50 border-2 border-slate-200 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-black text-slate-900 px-8 focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="borrowed">Borrowed</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="h-16 md:h-20 px-12 rounded-2xl md:rounded-[2rem] w-full text-base bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1"
                  onMouseEnter={playHover}
                >
                  <Plus className="mr-3 h-6 w-6" />
                  Commit Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renewal Requests (Admin Only) */}
      {isAdmin && renewalRequests.length > 0 && (
        <div className="animate-nova-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-grow bg-slate-100" />
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4 whitespace-nowrap">
              Administrative <span className="text-emerald-600 italic">Oversight</span>
              <span className="bg-emerald-100 text-emerald-600 py-1 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Renewal Queue</span>
            </h3>
            <div className="h-px flex-grow bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renewalRequests.map((req) => (
              <div key={req.id} className="glass-panel p-8 relative overflow-hidden group border-2 border-emerald-50 hover:border-emerald-200 transition-all">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xl">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{req.bookTitle}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Requester: {req.userName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Received</p>
                    <p className="text-sm font-black text-slate-900">{req.requestDate}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100"
                    onClick={() => {
                      playClick();
                      toast.success(`Access extended for ${req.bookTitle}`);
                      setRenewalRequests(renewalRequests.filter(r => r.id !== req.id));
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-xl border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100 font-black text-xs uppercase tracking-widest"
                    onClick={() => {
                      playClick();
                      toast.error(`Renewal denied: ${req.bookTitle}`);
                      setRenewalRequests(renewalRequests.filter(r => r.id !== req.id));
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Deny
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative animate-nova-in" style={{ animationDelay: '200ms' }}>
        <div className={`absolute inset-0 ${isAdmin ? 'bg-emerald-500/10' : 'bg-primary/10'} blur-[100px] rounded-[5rem] -z-10 transition-colors duration-700`} />
        <Search className={`absolute left-8 md:left-12 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:${isAdmin ? 'text-emerald-500' : 'text-primary'} transition-colors`} />
        <Input
          placeholder="QUERY ARCHIVE METADATA..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={`h-24 md:h-32 pl-20 md:pl-28 pr-48 md:pr-64 bg-white shadow-2xl focus:shadow-[0_40px_100px_-20px_rgba(${isAdmin ? '16,185,129' : '67,56,202'},0.15)] rounded-[2.5rem] md:rounded-[3.5rem] text-xl md:text-3xl font-black text-slate-900 transition-all focus:ring-[20px] focus:ring-${isAdmin ? 'emerald' : 'primary'}/5 border-white border-4`}
        />
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex items-center gap-4 md:gap-6">
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={clearSearch}
              className="h-16 w-16 rounded-full p-0 hover:bg-slate-50 transition-colors"
              onMouseEnter={playHover}
            >
              <X className="h-6 w-6 text-slate-400" />
            </Button>
          )}
          <Button
            onClick={handleSearch}
            className={`${isAdmin ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'btn-nova'} h-16 md:h-20 px-8 md:px-16 rounded-2xl md:rounded-[2.5rem] text-xs md:text-lg uppercase tracking-widest font-black text-white shadow-2xl transition-all`}
            onMouseEnter={playHover}
          >
            Execute
          </Button>
        </div>
      </div>

      {/* Grid of Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 animate-nova-in pb-40" style={{ animationDelay: '300ms' }}>
        {(hasSearched ? searchResults : books).map((book, idx) => (
          <div
            key={book.id}
            className="group card-3d relative"
            style={{ animationDelay: `${idx * 50}ms` }}
            onMouseEnter={playHover}
          >
            <div className="p-10 h-full flex flex-col justify-between relative bg-white border border-white rounded-[3rem] shadow-2xl hover:shadow-primary/10 transition-all duration-700 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />

              <div className="flex justify-between items-start mb-12">
                <div className={`w-20 h-20 rounded-[1.75rem] border-2 border-slate-50 flex items-center justify-center transition-all duration-500 shadow-xl bg-slate-50/50 ${isAdmin ? 'group-hover:bg-emerald-500 group-hover:shadow-emerald-200' : 'group-hover:bg-primary group-hover:shadow-primary/40'} group-hover:text-white`}>
                  <BookOpen className="h-8 w-8" />
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">#{idx + 1000}</span>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${book.status === 'available' ? 'bg-green-100/50 text-green-600 border border-green-200' :
                    book.status === 'reserved' ? 'bg-amber-100/50 text-amber-600 border border-amber-200' :
                      'bg-red-100/50 text-red-600 border border-red-200'
                    }`}>
                    {book.status}
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
                      {book.year}
                    </span>
                    <div className="flex gap-4">
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-2xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                          onClick={(e) => { e.stopPropagation(); handleDeleteBook(book.id); }}
                          onMouseEnter={playHover}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
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

                  <div className="grid grid-cols-2 gap-4">
                    {book.status === 'available' && (
                      <Button
                        onClick={() => handleReserve(book.id)}
                        className={`w-full bg-slate-900 text-white font-black h-14 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl ${isAdmin ? 'hover:bg-emerald-600 hover:shadow-emerald-200' : 'hover:bg-primary hover:shadow-primary/30'}`}
                      >
                        Reserve
                      </Button>
                    )}
                    {book.ebookUrl && (
                      <Button
                        variant="secondary"
                        onClick={() => handleAccessEbook(book.ebookUrl!)}
                        className={`${book.status === 'available' ? '' : 'col-span-2'} w-full font-black h-14 rounded-2xl text-xs uppercase tracking-widest transition-all border ${isAdmin ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
                      >
                        Access E-Book
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {((hasSearched ? searchResults : books).length === 0) && (
          <div className="col-span-full py-60 text-center glass-panel border-dashed group">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-colors">
              <Search className="h-10 w-10 text-slate-300 group-hover:text-primary transition-all" />
            </div>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">Archive Empty</h3>
            <p className="text-slate-400 font-bold text-lg mt-4 uppercase tracking-[0.2em]">Awaiting records or refine query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
