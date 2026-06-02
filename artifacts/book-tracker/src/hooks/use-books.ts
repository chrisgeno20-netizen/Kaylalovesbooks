import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book, InsertBook } from "@/types";
import { toast } from "sonner";

export const bookKeys = {
  all: ["books"] as const,
  detail: (id: string) => ["books", id] as const,
};

export function useBooks() {
  return useQuery({
    queryKey: bookKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Book[];
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Book;
    },
    enabled: !!id,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBook: InsertBook) => {
      const id = crypto.randomUUID();
      const { error } = await supabase.from("books").insert({
        id,
        ...newBook,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      toast.success("Book added to your journal");
    },
    onError: (error) => {
      toast.error("Failed to add book: " + error.message);
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBook> }) => {
      const { error } = await supabase
        .from("books")
        .update(data)
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(variables.id) });
      toast.success("Book updated");
    },
    onError: (error) => {
      toast.error("Failed to update book: " + error.message);
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      toast.success("Book removed from journal");
    },
    onError: (error) => {
      toast.error("Failed to delete book: " + error.message);
    },
  });
}
