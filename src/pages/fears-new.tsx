import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  useCreateFear,
  getListFearsQueryKey,
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Flame } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Please give this fear a name"),
  description: z.string().optional(),
  intensity: z.number().min(1).max(10),
  category: z.string().optional(),
});

export default function NewFear() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createFearMutation = useCreateFear();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      intensity: 5,
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createFearMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFearsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
          toast({
            title: "Fear logged",
            description: "Naming it is the first step to overcoming it.",
          });
          setLocation("/fears");
        },
        onError: (error) => {
          toast({
            title: "Could not save",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <header className="space-y-4">
        <Link href="/fears" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-serif tracking-tight text-foreground">Name the Shadow</h1>
            <p className="text-muted-foreground">What is troubling you tonight?</p>
          </div>
        </div>
      </header>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl shadow-black/20">
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-foreground/90">What is the fear?</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Failing at work, Being alone, The dark..." 
                        className="bg-background/50 h-12 text-lg focus-visible:ring-destructive/50 border-border/60" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Describe how it feels (optional)</FormLabel>
                    <FormDescription className="text-muted-foreground">
                      Writing it down helps externalize the emotion.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="My heart races when I think about..." 
                        className="min-h-[120px] bg-background/50 resize-none focus-visible:ring-destructive/50 border-border/60" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-foreground/90">Intensity Level: <span className="text-primary font-bold ml-1">{field.value}</span></FormLabel>
                    </div>
                    <FormControl>
                      <Slider 
                        min={1} 
                        max={10} 
                        step={1}
                        value={[field.value]} 
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 (Mild unease)</span>
                      <span>10 (Overwhelming)</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Category (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Work, Health, Social" 
                        className="bg-background/50 focus-visible:ring-destructive/50 border-border/60" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t border-border/50 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setLocation("/fears")} className="hover:bg-muted/50">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                  disabled={createFearMutation.isPending}
                >
                  {createFearMutation.isPending ? "Logging..." : "Log Fear"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
