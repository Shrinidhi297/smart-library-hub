import { useState, useEffect } from "react";
import { Search, BookOpen, X, Plus, Trash2, SlidersHorizontal, ArrowRight, SortAsc, Calendar, User } from "lucide-react";
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

interface Book {
  id: number;
  title: string;
  author: string;
  year: string;
}

const ADMIN_EMAIL = "sngangur123@gmail.com";

const BookSearch = () => {
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const { playHover, playClick } = useSoundEffects();

  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem("library_books");
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);

      // Pre-published highly demanded books
      return [
        { id: 1, title: "Atomic Habits", author: "James Clear", year: "2018" },
        { id: 2, title: "The Psychology of Money", author: "Morgan Housel", year: "2020" },
        { id: 3, title: "Deep Work", author: "Cal Newport", year: "2016" },
        { id: 4, title: "Zero to One", author: "Peter Thiel", year: "2014" },
        { id: 5, title: "The Alchemist", author: "Paulo Coelho", year: "1988" },
        { id: 6, title: "Sapiens", author: "Yuval Noah Harari", year: "2011" },
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
    };

    setBooks([...books, book]);
    setNewBook({ title: "", author: "", year: "" });
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
    <div className="w-full max-w-7xl mx-auto space-y-8 md:space-y-16 px-4 md:px-0">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 animate-nova-in">
        <div className="max-w-xl">
          <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold mb-4 md:mb-6 gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Database Active
          </div>
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 md:mb-6 leading-[1.1]">
            Explore the <br />
            <span className="text-primary italic">Digital Vault</span>
          </h2>
          <p className="text-slate-500 font-medium text-base md:text-lg">
            {isAdmin ? "Administrator panel for content curation and asset management." : "Browse our curated collection of academic and research materials."}
          </p>
        </div>

        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto rounded-xl md:rounded-2xl border-slate-200 hover:border-primary/50 hover:bg-white text-slate-600 font-bold h-12 md:h-14 px-6 md:px-8 transition-all"
                onMouseEnter={playHover}
              >
                Filters <SlidersHorizontal className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-2xl border-slate-100 p-2 rounded-2xl mt-4 shadow-2xl">
              <DropdownMenuItem
                className="cursor-pointer rounded-xl p-4 hover:bg-slate-50 group gap-3"
                onClick={() => sortBooks("title")}
                onMouseEnter={playHover}
              >
                <SortAsc className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary" />
                <span className={`font-bold ${sortType === 'title' ? 'text-primary' : 'text-slate-900'}`}>Sort by Title</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-xl p-4 hover:bg-slate-50 group gap-3"
                onClick={() => sortBooks("author")}
                onMouseEnter={playHover}
              >
                <User className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary" />
                <span className={`font-bold ${sortType === 'author' ? 'text-primary' : 'text-slate-900'}`}>Sort by Author</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-xl p-4 hover:bg-slate-50 group gap-3"
                onClick={() => sortBooks("year")}
                onMouseEnter={playHover}
              >
                <Calendar className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary" />
                <span className={`font-bold ${sortType === 'year' ? 'text-primary' : 'text-slate-900'}`}>Sort by Year (Newest)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <div className="animate-nova-in" style={{ animationDelay: '100ms' }}>
          <div className="glass-card p-6 md:p-12 border-white bg-white/60 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-6 md:mb-10 flex items-center gap-4">
              <Plus className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Ingest New Record
            </h3>

            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end relative z-10">
              <div className="space-y-3 md:space-y-4">
                <Label className="text-xs md:text-sm font-bold text-slate-500 ml-2">Record Title</Label>
                <Input
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="EX: QUANTUM MECHANICS"
                  className="bg-white border-slate-200 h-14 md:h-16 rounded-xl md:rounded-2xl font-bold text-slate-900 px-5 md:px-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-3 md:space-y-4">
                <Label className="text-xs md:text-sm font-bold text-slate-500 ml-2">Lead Author</Label>
                <Input
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="EX: DR. RICHARD F."
                  className="bg-white border-slate-200 h-14 md:h-16 rounded-xl md:rounded-2xl font-bold text-slate-900 px-5 md:px-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-3 md:space-y-4">
                <Label className="text-xs md:text-sm font-bold text-slate-500 ml-2">Pub Year</Label>
                <div className="flex gap-4">
                  <Input
                    value={newBook.year}
                    onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                    placeholder="2025"
                    className="bg-white border-slate-200 h-14 md:h-16 rounded-xl md:rounded-2xl font-bold text-slate-900 px-5 md:px-6 flex-1 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                  />
                  <Button
                    type="submit"
                    className="btn-nova h-14 md:h-16 w-14 md:w-16 p-0 shrink-0"
                    onMouseEnter={playHover}
                  >
                    <Plus className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative animate-nova-in" style={{ animationDelay: '200ms' }}>
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-[3rem] -z-10" />
        <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="SEARCH ARCHIVES..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-16 md:h-20 pl-14 md:pl-20 pr-32 md:pr-40 bg-white border-white shadow-xl focus:shadow-2xl rounded-2xl md:rounded-3xl text-base md:text-xl font-bold text-slate-900 transition-all focus:ring-4 focus:ring-primary/10"
        />
        <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-4">
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={clearSearch}
              className="h-9 w-9 md:h-12 md:w-12 rounded-full p-0 hover:bg-slate-50"
              onMouseEnter={playHover}
            >
              <X className="h-3.5 w-3.5 md:h-5 md:w-5 text-slate-400" />
            </Button>
          )}
          <Button
            onClick={handleSearch}
            className="btn-nova h-10 md:h-14 px-4 md:px-10 rounded-xl md:rounded-2xl text-[10px] md:text-base uppercase"
            onMouseEnter={playHover}
          >
            Execute
          </Button>
        </div>
      </div>

      {/* Grid of Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-nova-in pb-24" style={{ animationDelay: '300ms' }}>
        {(hasSearched ? searchResults : books).map((book, idx) => (
          <div
            key={book.id}
            onClick={() => handleBookClick(book)}
            className="group card-3d cursor-pointer"
            style={{ animationDelay: `${idx * 50}ms` }}
            onMouseEnter={playHover}
          >
            <div className="p-6 md:p-8 h-full flex flex-col justify-between relative bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem]">
              <div className="flex justify-between items-start mb-8 md:mb-12">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <BookOpen className="h-4.5 w-4.5 md:h-6 md:w-6" />
                </div>
                <span className="text-[8px] md:text-[10px] font-bold tracking-widest text-slate-300 uppercase pt-2">IDX_{idx + 100}</span>
              </div>

              <div>
                <h4 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-[1.2] mb-2 md:mb-3 group-hover:text-primary transition-colors">
                  {book.title}
                </h4>
                <p className="text-slate-400 md:text-slate-500 font-bold text-xs md:text-sm uppercase tracking-wide mb-6 md:mb-10">
                  {book.author}
                </p>

                <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-slate-50">
                  <span className="px-3 py-1 md:px-5 md:py-2 bg-slate-50 rounded-full text-[9px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    {book.year}
                  </span>
                  <div className="flex gap-4">
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                        onClick={(e) => { e.stopPropagation(); handleDeleteBook(book.id); }}
                        onMouseEnter={playHover}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary/25">
                      <ArrowRight className="h-4.5 w-4.5 text-slate-400 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {((hasSearched ? searchResults : books).length === 0) && (
          <div className="col-span-full py-40 text-center glass-card border-dashed">
            <Search className="h-9 w-9 text-slate-200 mx-auto mb-6" />
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Archive Empty</h3>
            <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest">Awaiting records or refine your query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
