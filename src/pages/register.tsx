import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRegisterUser } from "@workspace/api-client-react";
import { useAuth } from "@/components/auth-context";
import { useToast } from "@/hooks/use-toast";

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
import { Moon, ArrowLeft, Sparkles } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useRegisterUser();

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          login(data.token);
          toast({
            title: "Welcome",
            description: "Your journey begins here.",
          });
        },
        onError: (error) => {
          toast({
            title: "Could not create account",
            description: error.message || "An error occurred during registration.",
            variant: "destructive",
          });
        }
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to sanctuary
        </Link>
        
        <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-xl shadow-black/50">
          <div className="flex flex-col items-center mb-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,183,0,0.15)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-foreground tracking-wide">Find your lantern</h1>
              <p className="text-muted-foreground mt-2">Create a quiet space for your thoughts.</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">How should we call you?</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" className="bg-background/50 focus-visible:ring-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" className="bg-background/50 focus-visible:ring-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-background/50 focus-visible:ring-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,183,0,0.2)] hover:shadow-[0_0_30px_rgba(255,183,0,0.4)] transition-all mt-2"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating sanctuary..." : "Begin journey"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have a space?{" "}
            <Link href="/login" className="text-primary hover:underline underline-offset-4">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
