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

  return (
    <section className="section-padding bg-background">
      <div className="section-container max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            {isAdmin ? "Admin Dashboard" : "User Dashboard"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-6 text-foreground">
            {isAdmin ? "Manage Library Collection" : "Browse Library"}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {isAdmin
              ? "Add new books to the library database."
              : "Search through our collection of books."}
          </p>
        </div>

        {/* Add Book Form - ONLY FOR ADMIN */}
        {isAdmin && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-card border shadow-sm rounded-xl p-6 mb-8">
              <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Book
              </h3>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-foreground mb-2 block">
                      Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      placeholder="Enter book title"
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author" className="text-foreground mb-2 block">
                      Author
                    </Label>
                    <Input
                      id="author"
                      type="text"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      placeholder="Enter author name"
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year" className="text-foreground mb-2 block">
                      Year
                    </Label>
                    <Input
                      id="year"
                      type="text"
                      value={newBook.year}
                      onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                      placeholder="Enter year"
                      className="bg-background text-foreground"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full md:w-auto px-8"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 pr-10 py-6 text-lg bg-background text-foreground border rounded-xl shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold rounded-xl"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold">
                {searchResults.length > 0
                  ? `Found ${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`
                  : "No results found"}
              </h3>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl p-6 text-foreground flex flex-col sm:flex-row gap-4 items-start sm:items-center card-hover shadow-sm border"
                  >
                    <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg font-bold text-foreground mb-1">
                        {book.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        by {book.author}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                          Year: {book.year}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No books found matching "{searchQuery}"
                </p>
                <p className="text-muted-foreground/60 text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show All Books */}
        {!hasSearched && books.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-xl font-semibold mb-6">
              All Books ({books.length})
            </h3>
            <div className="grid gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl p-6 text-foreground flex flex-col sm:flex-row gap-4 items-start sm:items-center card-hover shadow-sm border"
                >
                  <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-lg font-bold text-foreground mb-1">
                      {book.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      by {book.author}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        Year: {book.year}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleDeleteBook(book.id)}
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
          <div className="max-w-4xl mx-auto text-center py-12 bg-muted/30 rounded-xl border border-dashed">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No books in your library yet
            </p>
            {isAdmin && (
              <p className="text-muted-foreground/60 text-sm mt-2">
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
