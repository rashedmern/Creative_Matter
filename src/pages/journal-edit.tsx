import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  useGetJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
  getGetJournalEntryQueryKey,
  getListJournalEntriesQueryKey,
  getGetUserStatsQueryKey
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash2, Calendar, Edit3 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Please give your entry a title"),
  content: z.string().min(10, "Please write a bit more"),
  mood: z.string().optional(),
  fearLevel: z.number().min(1).max(10).optional(),
});

export default function EditJournal() {
  const { id } = useParams<{ id: string }>();
  const entryId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);

  const { data: entry, isLoading, isError } = useGetJournalEntry(entryId, {
    query: {
      enabled: !!entryId && !isNaN(entryId),
    }
  });

  const updateJournalMutation = useUpdateJournalEntry();
  const deleteJournalMutation = useDeleteJournalEntry();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      fearLevel: 5,
    },
  });

  // Reset form when data loads
  useEffect(() => {
    if (entry) {
      form.reset({
        title: entry.title,
        content: entry.content,
        mood: entry.mood || "",
        fearLevel: entry.fearLevel || 5,
      });
    }
  }, [entry, form]);

  if (isError) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl text-destructive font-serif mb-2">Could not find entry</h2>
        <Button variant="outline" asChild>
          <Link href="/journal">Back to Journal</Link>
        </Button>
      </div>
    );
  }

  if (isLoading || !entry) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-24" />
        <Card className="bg-card/40 border-border/50">
          <CardContent className="p-10 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <div className="space-y-3 pt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateJournalMutation.mutate(
      { id: entryId, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetJournalEntryQueryKey(entryId) });
          queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
          toast({
            title: "Entry updated",
          });
          setIsEditing(false);
        },
        onError: (error) => {
          toast({
            title: "Update failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  }

  function handleDelete() {
    deleteJournalMutation.mutate(
      { id: entryId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
          toast({
            title: "Entry deleted",
            description: "The pages have been burned.",
          });
          setLocation("/journal");
        },
        onError: (error) => {
          toast({
            title: "Delete failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/journal" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to journal
        </Link>
        
        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-card/50">
              <Edit3 className="w-4 h-4 mr-2" /> Edit
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Burn these pages?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This journal entry will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-muted/50">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete entry
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-xl shadow-black/20 overflow-hidden">
        <CardContent className="p-6 sm:p-10">
          {!isEditing ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-4 border-b border-border/40 pb-6">
                <h1 className="text-3xl sm:text-4xl font-serif text-foreground leading-tight">{entry.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4" /> {format(new Date(entry.createdAt), "EEEE, MMMM do, yyyy")}
                  </span>
                  {entry.mood && (
                    <span className="bg-muted/30 px-2 py-1 rounded">Mood: {entry.mood}</span>
                  )}
                  {entry.fearLevel !== undefined && (
                    <span className="bg-muted/30 px-2 py-1 rounded">Anxiety: {entry.fearLevel}/10</span>
                  )}
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-lg leading-loose font-serif text-foreground/90">
                  {entry.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 h-14 text-3xl sm:text-4xl font-serif focus-visible:ring-0 focus-visible:border-primary" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            className="min-h-[400px] bg-transparent border-0 px-0 text-lg leading-loose focus-visible:ring-0 resize-y font-serif" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-border/40 bg-muted/10 p-6 rounded-xl -mx-6 sm:-mx-10 sm:px-10">
                    <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm">Mood</FormLabel>
                          <FormControl>
                            <Input className="bg-background/60 border-border/60 focus-visible:ring-primary/30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fearLevel"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-foreground/80 text-sm">Anxiety Level</FormLabel>
                            <span className="text-primary font-medium text-sm">{field.value}/10</span>
                          </div>
                          <FormControl>
                            <Slider 
                              min={1} 
                              max={10} 
                              step={1}
                              value={[field.value || 5]} 
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => {
                        form.reset();
                        setIsEditing(false);
                      }} 
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={updateJournalMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" /> {updateJournalMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
