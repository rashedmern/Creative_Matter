import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLoginUser } from "@workspace/api-client-react";
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
import { Moon, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginUser();

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          login(data.token);
          toast({
            title: "Welcome back",
            description: "The lantern is lit.",
          });
        },
        onError: (error) => {
          toast({
            title: "Could not log in",
            description: error.message || "Please check your credentials and try again.",
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
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-foreground tracking-wide">Welcome back</h1>
              <p className="text-muted-foreground mt-2">Step out of the shadows.</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,183,0,0.2)] hover:shadow-[0_0_30px_rgba(255,183,0,0.4)] transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Lighting the lantern..." : "Log in"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline underline-offset-4">
              Find your lantern
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
