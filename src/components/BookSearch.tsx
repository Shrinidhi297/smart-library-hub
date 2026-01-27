import { useState, useEffect } from "react";
import { Search, BookOpen, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/clerk-react";

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

  // Initialize books from localStorage or empty array
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem("library_books");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Form state
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
  });

  // Save to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem("library_books", JSON.stringify(books));
  }, [books]);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Show success message
    alert("Book added successfully!");
  };

  const handleDeleteBook = (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
      // Also update search results if active
      if (hasSearched) {
        setSearchResults(searchResults.filter((book) => book.id !== id));
      }
    }
  };

  const handleBookClick = (book: Book) => {
    // Search on Google Books which has "Get this book in print" and preview options
    const query = `${book.title} ${book.author}`;
    window.open(`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background via-background to-muted/30">
      <div className="section-container max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            {isAdmin ? "Admin Dashboard" : "User Dashboard"}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-6 text-foreground leading-tight">
            {isAdmin ? "Manage Library " : "Browse Library "}
            <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            {isAdmin
              ? "Add new books to the library database and manage your collection."
              : "Search through our extensive collection of books."}
          </p>
        </div>

        {/* Add Book Form - ONLY FOR ADMIN */}
        {isAdmin && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl rounded-3xl p-8 card-hover">
              <h3 className="font-serif text-2xl font-semibold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-secondary-foreground" />
                </div>
                Add New Book
              </h3>
              <form onSubmit={handleAddBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      placeholder="Enter book title"
                      className="bg-background/50 text-foreground border-border/50 rounded-xl h-12 focus:ring-2 focus:ring-secondary/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-foreground font-medium">
                      Author
                    </Label>
                    <Input
                      id="author"
                      type="text"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      placeholder="Enter author name"
                      className="bg-background/50 text-foreground border-border/50 rounded-xl h-12 focus:ring-2 focus:ring-secondary/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-foreground font-medium">
                      Year
                    </Label>
                    <Input
                      id="year"
                      type="text"
                      value={newBook.year}
                      onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                      placeholder="Enter year"
                      className="bg-background/50 text-foreground border-border/50 rounded-xl h-12 focus:ring-2 focus:ring-secondary/30 transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-lg w-full md:w-auto px-10 py-6 rounded-xl font-semibold transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Book
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Search Box */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="relative pl-14 pr-12 py-7 text-lg bg-card/80 backdrop-blur-sm text-foreground border-border/50 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-secondary/30"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              size="lg"
              className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-xl px-10 py-7 text-lg font-semibold rounded-2xl transition-all duration-300 glow-effect"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-semibold flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-secondary" />
                </div>
                {searchResults.length > 0
                  ? `Found ${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`
                  : "No results found"}
              </h3>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid gap-5">
                {searchResults.map((book, index) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className="cursor-pointer bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-foreground flex flex-col sm:flex-row gap-5 items-start sm:items-center card-hover shadow-lg border border-border/50 animate-fade-in transition-all hover:bg-card/90"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-16 h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-xl font-bold text-foreground mb-1">
                        {book.title}
                      </h4>
                      <p className="text-muted-foreground mb-3">
                        by {book.author}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-muted/50 rounded-lg text-xs font-medium text-muted-foreground">
                          📅 Year: {book.year}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBook(book.id);
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card/50 backdrop-blur-sm rounded-3xl border border-dashed border-border/50">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground text-xl font-medium">
                  No books found matching "{searchQuery}"
                </p>
                <p className="text-muted-foreground/60 text-sm mt-3">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show All Books */}
        {!hasSearched && books.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-secondary" />
              </div>
              All Books ({books.length})
            </h3>
            <div className="grid gap-5">
              {books.map((book, index) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="cursor-pointer bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-foreground flex flex-col sm:flex-row gap-5 items-start sm:items-center card-hover shadow-lg border border-border/50 animate-fade-in transition-all hover:bg-card/90"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-xl font-bold text-foreground mb-1">
                      {book.title}
                    </h4>
                    <p className="text-muted-foreground mb-3">
                      by {book.author}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-muted/50 rounded-lg text-xs font-medium text-muted-foreground">
                        📅 Year: {book.year}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBook(book.id);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && books.length === 0 && (
          <div className="max-w-4xl mx-auto text-center py-20 bg-card/50 backdrop-blur-sm rounded-3xl border border-dashed border-border/50">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-2xl font-medium font-serif">
              No books in your library yet
            </p>
            {isAdmin && (
              <p className="text-muted-foreground/60 mt-4">
                Add your first book using the form above
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSearch;
