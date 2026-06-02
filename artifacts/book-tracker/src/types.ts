import { z } from "zod";

export const feelingEnum = z.enum(["dnf", "liked", "really_liked", "loved"]);
export type Feeling = z.infer<typeof feelingEnum>;

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().nullable().optional(),
  feeling: feelingEnum,
  notes: z.string().nullable().optional(),
  created_at: z.string(),
});

export type Book = z.infer<typeof bookSchema>;

export const insertBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().optional(),
  feeling: feelingEnum,
  notes: z.string().optional(),
});

export type InsertBook = z.infer<typeof insertBookSchema>;
