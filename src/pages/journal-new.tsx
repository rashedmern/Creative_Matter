import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  useCreateJournalEntry,
  getListJournalEntriesQueryKey,
  getGetUserStatsQueryKey
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

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
import { ArrowLeft, PenTool, Calendar } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(2, "Please give your entry a title"),
  content: z.string().min(10, "Please write a bit more"),
  mood: z.string().optional(),
  fearLevel: z.number().min(1).max(10).optional(),
});

export default function NewJournal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createJournalMutation = useCreateJournalEntry();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      fearLevel: 5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createJournalMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
          toast({
            title: "Entry saved",
            description: "Your thoughts are safe here.",
          });
          setLocation("/journal");
        },
        onError: (error) => {
          toast({
            title: "Could not save entry",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  }

  const today = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <header className="flex items-center justify-between">
        <Link href="/journal" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="text-sm text-primary/70 flex items-center gap-1.5 font-serif">
          <Calendar className="w-3.5 h-3.5" /> {today}
        </div>
      </header>

      <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Subtle decorative top border */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardContent className="p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/40">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <PenTool className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-serif text-foreground">New Entry</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Give this night a title..." 
                        className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 h-14 text-2xl font-serif focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50" 
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
                        placeholder="Start writing..." 
                        className="min-h-[300px] bg-transparent border-0 px-0 text-lg leading-relaxed focus-visible:ring-0 resize-y placeholder:text-muted-foreground/30 font-serif" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-border/40">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 text-sm">Current Mood</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Restless, Calm, Anxious" 
                          className="bg-background/40 border-border/60 focus-visible:ring-primary/30" 
                          {...field} 
                        />
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
                          className="py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setLocation("/journal")} 
                  className="hover:bg-muted/50"
                >
                  Discard
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(255,183,0,0.2)] min-w[120px]"
                  disabled={createJournalMutation.isPending}
                >
                  {createJournalMutation.isPending ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
