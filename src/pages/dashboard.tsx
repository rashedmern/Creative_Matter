import { Link } from "wouter";
import { format } from "date-fns";
import { useAuth } from "@/components/auth-context";
import { 
  useGetDailyAffirmation, 
  useGetUserStats, 
  useListFears, 
  useListJournalEntries 
} from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, BookOpen, Heart, ArrowRight, Activity, Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: affirmation, isLoading: isAffirmationLoading } = useGetDailyAffirmation();
  const { data: stats, isLoading: isStatsLoading } = useGetUserStats();
  const { data: fears, isLoading: isFearsLoading } = useListFears({ resolved: false });
  const { data: journals, isLoading: isJournalsLoading } = useListJournalEntries();

  const recentFears = fears?.slice(0, 3) || [];
  const recentJournals = journals?.slice(0, 3) || [];

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif tracking-tight">Good evening, {user?.name || "traveler"}.</h1>
        <p className="text-muted-foreground text-lg">Welcome to your sanctuary. The lantern is lit.</p>
      </header>

      {/* Daily Affirmation */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
        <Card className="bg-primary/5 border-primary/20 shadow-[0_0_20px_rgba(255,183,0,0.05)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(255,183,0,0.2)]">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
              <p className="text-sm font-medium text-primary/80 uppercase tracking-widest">Daily Light</p>
              {isAffirmationLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4 bg-primary/10" />
                  <Skeleton className="h-8 w-1/2 bg-primary/10" />
                </div>
              ) : (
                <>
                  <blockquote className="text-2xl md:text-3xl font-serif text-foreground">"{affirmation?.text}"</blockquote>
                  {affirmation?.author && <cite className="text-sm text-muted-foreground block mt-2">— {affirmation.author}</cite>}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Activity className="w-5 h-5 text-primary/60 mb-1" />
            <p className="text-3xl font-serif text-foreground">
              {isStatsLoading ? <Skeleton className="h-9 w-12 mx-auto bg-primary/10" /> : stats?.currentStreak || 0}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Flame className="w-5 h-5 text-destructive/60 mb-1" />
            <p className="text-3xl font-serif text-foreground">
              {isStatsLoading ? <Skeleton className="h-9 w-12 mx-auto bg-primary/10" /> : stats?.resolvedFears || 0}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Fears Resolved</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <BookOpen className="w-5 h-5 text-primary/60 mb-1" />
            <p className="text-3xl font-serif text-foreground">
              {isStatsLoading ? <Skeleton className="h-9 w-12 mx-auto bg-primary/10" /> : stats?.totalJournalEntries || 0}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Journal Entries</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Heart className="w-5 h-5 text-primary/60 mb-1" />
            <p className="text-3xl font-serif text-foreground">
              {isStatsLoading ? <Skeleton className="h-9 w-16 mx-auto bg-primary/10" /> : `${stats?.progressPercentage || 0}%`}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Overcome Rate</p>
          </CardContent>
        </Card>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Fears */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive/80" /> Active Shadows
            </h2>
            <Link href="/fears/new" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Name a fear
            </Link>
          </div>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
            {isFearsLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full bg-primary/5 rounded-xl" />
                ))}
              </div>
            ) : recentFears.length > 0 ? (
              <div className="divide-y divide-border/30">
                {recentFears.map(fear => (
                  <div key={fear.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{fear.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>Intensity: {fear.intensity}/10</span>
                        {fear.category && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                            <span>{fear.category}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <Link href="/fears" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary p-2">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
                <div className="p-4 bg-muted/10 text-center">
                  <Link href="/fears" className="text-sm text-primary hover:underline underline-offset-4">
                    View all active fears
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <Flame className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground text-sm">No active fears logging in the shadows.</p>
                <Button variant="outline" className="bg-transparent border-primary/20 text-primary hover:bg-primary/10" asChild>
                  <Link href="/fears/new">Log a new fear</Link>
                </Button>
              </div>
            )}
          </Card>
        </section>

        {/* Recent Journals */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary/80" /> Night Thoughts
            </h2>
            <Link href="/journal/new" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Write entry
            </Link>
          </div>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
            {isJournalsLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full bg-primary/5 rounded-xl" />
                ))}
              </div>
            ) : recentJournals.length > 0 ? (
              <div className="divide-y divide-border/30">
                {recentJournals.map(entry => (
                  <div key={entry.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{entry.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <Link href={`/journal/${entry.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary p-2 hover:bg-primary/10 rounded-full">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
                <div className="p-4 bg-muted/10 text-center">
                  <Link href="/journal" className="text-sm text-primary hover:underline underline-offset-4">
                    Read past entries
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground text-sm">Your notebook is currently empty.</p>
                <Button variant="outline" className="bg-transparent border-primary/20 text-primary hover:bg-primary/10" asChild>
                  <Link href="/journal/new">Start a new entry</Link>
                </Button>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
