import { Link } from "wouter";
import { format } from "date-fns";
import { useListJournalEntries } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Plus, ArrowRight, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Journal() {
  const { data: entries, isLoading } = useListJournalEntries();

  const sortedEntries = [...(entries || [])].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary/80" /> 
            Night Journal
          </h1>
          <p className="text-muted-foreground mt-2">When you can't sleep, release your thoughts here.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(255,183,0,0.15)]">
          <Link href="/journal/new">
            <Plus className="w-4 h-4 mr-2" /> Write entry
          </Link>
        </Button>
      </header>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border/50 hidden sm:block" />

        <div className="space-y-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-6">
                <Skeleton className="w-14 h-14 rounded-full shrink-0 hidden sm:block bg-primary/5" />
                <Skeleton className="h-40 w-full bg-primary/5 rounded-xl" />
              </div>
            ))
          ) : sortedEntries.length > 0 ? (
            sortedEntries.map((entry, i) => (
              <div 
                key={entry.id} 
                className="flex gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Timeline node */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-card border border-border/80 flex items-center justify-center shrink-0 hidden sm:flex shadow-sm shadow-black/20 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                  <span className="text-xs font-medium uppercase text-center leading-tight">
                    {format(new Date(entry.createdAt), "MMM\nd")}
                  </span>
                </div>

                <Card className="flex-1 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-colors group-hover:border-border/80">
                  <Link href={`/journal/${entry.id}`}>
                    <CardContent className="p-5 sm:p-6 cursor-pointer h-full flex flex-col">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="text-xl font-serif text-foreground line-clamp-1">{entry.title}</h3>
                        <div className="sm:hidden text-xs text-muted-foreground whitespace-nowrap bg-muted/30 px-2 py-1 rounded-md">
                          {format(new Date(entry.createdAt), "MMM d")}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-1">
                        {entry.content}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          {entry.mood && (
                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                              Mood: <span className="text-foreground/80">{entry.mood}</span>
                            </span>
                          )}
                          {entry.fearLevel !== undefined && (
                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                              Anxiety: <span className="text-foreground/80">{entry.fearLevel}/10</span>
                            </span>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            ))
          ) : (
            <div className="p-12 text-center space-y-4 bg-card/20 rounded-2xl border border-border/50 border-dashed ml-0 sm:ml-20">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto shadow-[0_0_20px_rgba(255,183,0,0.1)]">
                <PenTool className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-foreground">Your notebook is empty</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  The pages are waiting for your thoughts.
                </p>
              </div>
              <Button asChild variant="outline" className="bg-card/50 mt-2 border-primary/30 text-primary hover:bg-primary/10">
                <Link href="/journal/new">Write your first entry</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
