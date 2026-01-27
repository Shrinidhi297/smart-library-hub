import { useState } from "react";
import { Search, BookOpen, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sampleBooks = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    author: "Dr. Sarah Johnson",
    category: "Technology",
    available: true,
    isbn: "978-0-123456-78-9",
  },
  {
    id: 2,
    title: "Advanced Mathematics for Engineers",
    author: "Prof. Michael Chen",
    category: "Mathematics",
    available: true,
    isbn: "978-0-234567-89-0",
  },
  {
    id: 3,
    title: "Modern Physics: A Comprehensive Guide",
    author: "Dr. Emily Williams",
    category: "Science",
    available: false,
    isbn: "978-0-345678-90-1",
  },
  {
    id: 4,
    title: "Data Structures and Algorithms",
    author: "Prof. James Anderson",
    category: "Technology",
    available: true,
    isbn: "978-0-456789-01-2",
  },
  {
    id: 5,
    title: "Introduction to Psychology",
    author: "Dr. Lisa Brown",
    category: "Psychology",
    available: true,
    isbn: "978-0-567890-12-3",
  },
];

const BookSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof sampleBooks>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const results = sampleBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <section id="search" className="section-padding bg-primary text-primary-foreground">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Book Search
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-6">
            Find Your Next Read
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Search through our extensive collection of books, journals, and research papers. 
            Simply enter a title, author, or category to get started.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 pr-10 py-6 text-lg bg-white text-foreground border-0 rounded-xl"
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

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <span className="text-primary-foreground/60 text-sm mr-2 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Quick filters:
            </span>
            {["Technology", "Mathematics", "Science", "Psychology"].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSearchQuery(category);
                  setTimeout(handleSearch, 100);
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {category}
              </button>
            ))}
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
                    className="bg-white rounded-xl p-6 text-foreground flex flex-col sm:flex-row gap-4 items-start sm:items-center card-hover"
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
                          {book.category}
                        </span>
                        <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                          ISBN: {book.isbn}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          book.available
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.available ? "Available" : "Borrowed"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!book.available}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {book.available ? "Borrow" : "Reserve"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-xl">
                <BookOpen className="h-16 w-16 text-primary-foreground/40 mx-auto mb-4" />
                <p className="text-primary-foreground/60 text-lg">
                  No books found matching "{searchQuery}"
                </p>
                <p className="text-primary-foreground/40 text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSearch;
