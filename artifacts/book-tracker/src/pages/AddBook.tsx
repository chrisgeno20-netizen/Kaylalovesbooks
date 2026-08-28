import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { insertBookSchema, InsertBook, Feeling } from "@/types";
import { useCreateBook } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export default function AddBook() {
  const [, setLocation] = useLocation();
  const createBook = useCreateBook();

  const form = useForm<InsertBook>({
    resolver: zodResolver(insertBookSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      feeling: undefined,
      notes: "",
    },
  });

  const onSubmit = (data: InsertBook) => {
    createBook.mutate(data, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  const feelings: { value: Feeling; label: string }[] = [
    { value: "dnf", label: "DNF" },
    { value: "fine", label: "Fine" },
    { value: "liked", label: "Liked" },
    { value: "really_liked", label: "Really Liked" },
    { value: "loved", label: "Loved" },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-24">
      <header className="pt-10 pb-6 px-6 max-w-2xl mx-auto flex items-center gap-4">
        <button 
          onClick={() => setLocation("/")}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-serif font-medium text-foreground">Log a Book</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 sm:p-8 rounded-lg border border-border/50 shadow-sm">
            
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-sm font-medium">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="The Secret History" className="bg-background" {...field} data-testid="input-title" />
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
                      <Input placeholder="Donna Tartt" className="bg-background" {...field} data-testid="input-author" />
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
                      <Input placeholder="Fiction" className="bg-background" {...field} data-testid="input-genre" />
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
                  <FormLabel className="text-sm font-medium">How did you feel about it?</FormLabel>
                  <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1" data-testid="group-feeling">
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
                  <FormLabel className="text-sm font-medium">Thoughts & Notes <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What lingered with you after closing it?" 
                      className="min-h-[120px] bg-background resize-y" 
                      {...field} 
                      data-testid="input-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setLocation("/")} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" disabled={createBook.isPending} data-testid="button-save" className="min-w-[100px]">
                {createBook.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save to Journal"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
