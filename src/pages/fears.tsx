import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  useListFears, 
  useUpdateFear, 
  useDeleteFear,
  getListFearsQueryKey,
  getGetUserStatsQueryKey
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Flame, Plus, CheckCircle2, Trash2, ArrowLeft, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Fears() {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activeFears, isLoading: isActiveLoading } = useListFears({ resolved: false });
  const { data: resolvedFears, isLoading: isResolvedLoading } = useListFears({ resolved: true });

  const updateFearMutation = useUpdateFear();
  const deleteFearMutation = useDeleteFear();

  const isLoading = isActiveLoading || isResolvedLoading;

  const fears = [
    ...(activeFears || []),
    ...(resolvedFears || [])
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredFears = fears.filter(fear => {
    if (filter === "all") return true;
    if (filter === "active") return !fear.resolved;
    if (filter === "resolved") return fear.resolved;
    return true;
  });

  const handleResolve = (id: number, resolved: boolean) => {
    updateFearMutation.mutate(
      { id, data: { resolved } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFearsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
          toast({
            title: resolved ? "Fear resolved" : "Fear reactivated",
            description: resolved ? "You've grown stronger today." : "It's okay to still be afraid. We face it again.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error updating fear",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteFearMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFearsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
          toast({
            title: "Fear deleted",
            description: "The record has been burned.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error deleting fear",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 w-fit">
            <ArrowLeft className="w-4 h-4" /> Return
          </Link>
          <h1 className="text-4xl font-serif tracking-tight flex items-center gap-3">
            <Flame className="w-8 h-8 text-destructive/80" /> 
            Face the Dark
          </h1>
          <p className="text-muted-foreground mt-2">Name what frightens you. Break it down.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(255,183,0,0.15)]">
          <Link href="/fears/new">
            <Plus className="w-4 h-4 mr-2" /> Log new fear
          </Link>
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilter("all")}
          className={cn("rounded-full border-border/50", filter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card/30")}
        >
          All
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilter("active")}
          className={cn("rounded-full border-border/50", filter === "active" ? "bg-destructive text-destructive-foreground border-destructive" : "bg-card/30")}
        >
          Active Shadows
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilter("resolved")}
          className={cn("rounded-full border-border/50", filter === "resolved" ? "bg-emerald-600 text-white border-emerald-600" : "bg-card/30")}
        >
          Overcome
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full bg-primary/5 rounded-xl" />
          ))
        ) : filteredFears.length > 0 ? (
          filteredFears.map((fear, i) => (
            <Card 
              key={fear.id} 
              className={cn(
                "bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
                fear.resolved && "opacity-60 grayscale-[0.5]"
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className={cn("text-xl font-medium", fear.resolved && "line-through text-muted-foreground")}>
                      {fear.title}
                    </h3>
                    {fear.resolved && (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Overcome
                      </Badge>
                    )}
                  </div>
                  
                  {fear.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {fear.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <Flame className={cn("w-3 h-3", fear.intensity > 7 ? "text-destructive" : "text-primary/70")} />
                      Intensity: {fear.intensity}/10
                    </span>
                    {fear.category && (
                      <span className="px-2 py-1 rounded-full bg-muted/50 border border-border/50">
                        {fear.category}
                      </span>
                    )}
                    <span>Logged {format(new Date(fear.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center justify-end gap-2 border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-4">
                  <Button
                    variant={fear.resolved ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      "w-full sm:w-32",
                      !fear.resolved && "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(5,150,105,0.2)]"
                    )}
                    onClick={() => handleResolve(fear.id, !fear.resolved)}
                    disabled={updateFearMutation.isPending}
                  >
                    {fear.resolved ? "Reactivate" : "Mark Resolved"}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full sm:w-32 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Burn this record?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{fear.title}". Only do this if you no longer need to track this fear.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-muted/50">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(fear.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Burn it
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center space-y-4 bg-card/20 rounded-2xl border border-border/50 border-dashed">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto shadow-[0_0_20px_rgba(255,183,0,0.1)]">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-foreground">No fears found</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {filter === "all" 
                  ? "Your list is empty. Are you ready to face a new shadow?" 
                  : filter === "active" 
                    ? "No active fears. You are walking in the light."
                    : "No resolved fears yet. Every journey takes time."}
              </p>
            </div>
            {filter !== "all" && (
              <Button variant="outline" onClick={() => setFilter("all")} className="mt-2">
                View all
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
