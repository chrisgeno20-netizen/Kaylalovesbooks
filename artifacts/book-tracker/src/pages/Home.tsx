import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Plus, Search, BookOpen } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeelingBadge } from "@/components/FeelingBadge";

export default function Home() {
  const { data: books, isLoading } = useBooks();
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [filterFeeling, setFilterFeeling] = useState<string>("all");

  const genres = useMemo(() => {
    if (!books) return [];
    const g = new Set(books.map(b => b.genre).filter(Boolean));
    return Array.from(g) as string[];
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = filterGenre === "all" || book.genre === filterGenre;
      const matchesFeeling = filterFeeling === "all" || book.feeling === filterFeeling;
      return matchesSearch && matchesGenre && matchesFeeling;
    });
  }, [books, search, filterGenre, filterFeeling]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-24 selection:bg-primary/20">
      <header className="pt-12 pb-8 px-6 max-w-2xl mx-auto border-b border-border/50">
        <h1 className="text-4xl font-serif font-medium text-foreground tracking-tight" data-testid="text-app-title">Reading Journal</h1>
        <p className="text-muted-foreground mt-2 text-sm font-serif italic">A quiet space for the books you've finished.</p>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              className="pl-9 bg-card border-border/50 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="w-[130px] bg-card border-border/50 shadow-sm" data-testid="select-genre">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterFeeling} onValueChange={setFilterFeeling}>
              <SelectTrigger className="w-[130px] bg-card border-border/50 shadow-sm" data-testid="select-feeling">
                <SelectValue placeholder="Feeling" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feelings</SelectItem>
                <SelectItem value="dnf">DNF</SelectItem>
                  <SelectItem value="fine">Fine</SelectItem>
                <SelectItem value="liked">Liked</SelectItem>
                <SelectItem value="really_liked">Really Liked</SelectItem>
                <SelectItem value="loved">Loved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-md" />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} data-testid={`link-book-${book.id}`}>
                <Card className="group cursor-pointer hover:border-primary/30 transition-colors bg-card shadow-sm hover:shadow-md border-border/50">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {book.genre && (
                        <span className="text-xs uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-sm font-medium">
                          {book.genre}
                        </span>
                      )}
                      <FeelingBadge feeling={book.feeling} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 border border-dashed border-border rounded-lg bg-card/50">
            <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-medium text-foreground mb-1">No books found</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {books?.length === 0 
                ? "Your journal is empty. Add a book you've recently finished to get started." 
                : "No books match your current search and filters."}
            </p>
          </div>
        )}
      </main>

      <Link href="/add" data-testid="link-add-book">
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
}
