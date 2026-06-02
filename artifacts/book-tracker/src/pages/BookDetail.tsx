import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Edit2, Trash2, Loader2, BookOpen } from "lucide-react";
import { insertBookSchema, InsertBook, Feeling } from "@/types";
import { useBook, useUpdateBook, useDeleteBook } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FeelingBadge } from "@/components/FeelingBadge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function BookDetail() {
  const params = useParams();
  const id = params.id as string;
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  const { data: book, isLoading } = useBook(id);
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const form = useForm<InsertBook>({
    resolver: zodResolver(insertBookSchema),
    values: book ? {
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      feeling: book.feeling,
      notes: book.notes || "",
    } : undefined,
  });

  const onSubmit = (data: InsertBook) => {
    updateBook.mutate({ id, data }, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    deleteBook.mutate(id, {
      onSuccess: () => setLocation("/")
    });
  };

  const feelings: { value: Feeling; label: string }[] = [
    { value: "dnf", label: "DNF" },
    { value: "liked", label: "Liked" },
    { value: "really_liked", label: "Really Liked" },
    { value: "loved", label: "Loved" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center gap-4 text-center px-6">
        <BookOpen className="w-12 h-12 text-muted-foreground/30" />
        <h2 className="text-xl font-serif text-foreground">Book not found</h2>
        <Button variant="outline" onClick={() => setLocation("/")}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-24 selection:bg-primary/20">
      <header className="pt-10 pb-6 px-6 max-w-2xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => setLocation("/")}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} data-testid="button-edit">
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" data-testid="button-delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove "{book.title}" from your journal. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-delete">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-6">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 sm:p-8 rounded-lg border border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-sm font-medium">Title</FormLabel>
                      <FormControl>
                        <Input className="bg-background" {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Author</FormLabel>
                      <FormControl>
                        <Input className="bg-background" {...field} data-testid="input-author" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Genre <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input className="bg-background" {...field} data-testid="input-genre" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="feeling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Feeling</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {feelings.map((f) => (
                          <button
                            key={f.value}
                            type="button"
                            onClick={() => field.onChange(f.value)}
                            className={cn(
                              "px-3 py-3 text-sm rounded-md transition-all border outline-none",
                              field.value === f.value 
                                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:bg-muted"
                            )}
                            data-testid={`button-feeling-${f.value}`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Thoughts & Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="min-h-[160px] bg-background resize-y" 
                        {...field} 
                        data-testid="input-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" disabled={updateBook.isPending} data-testid="button-save" className="min-w-[100px]">
                  {updateBook.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {book.genre && (
                  <span className="text-xs uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-sm font-medium">
                    {book.genre}
                  </span>
                )}
                <FeelingBadge feeling={book.feeling} />
                <span className="text-xs text-muted-foreground ml-auto">
                  Logged on {new Date(book.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-medium leading-tight text-foreground" data-testid="text-book-title">
                {book.title}
              </h1>
              <p className="text-xl font-serif italic text-muted-foreground" data-testid="text-book-author">
                by {book.author}
              </p>
            </div>

            <div className="prose prose-stone dark:prose-invert max-w-none">
              {book.notes ? (
                <div className="whitespace-pre-wrap text-foreground/90 font-serif leading-relaxed text-lg" data-testid="text-book-notes">
                  {book.notes}
                </div>
              ) : (
                <p className="text-muted-foreground italic font-serif" data-testid="text-no-notes">
                  No notes recorded for this book.
                </p>
              )}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
