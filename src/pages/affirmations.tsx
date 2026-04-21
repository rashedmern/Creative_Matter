import { useListAffirmations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Sparkles, Moon } from "lucide-react";

export default function Affirmations() {
  const { data: affirmations, isLoading } = useListAffirmations();

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <header className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-[0_0_30px_rgba(255,183,0,0.15)]">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight">The Lantern</h1>
        <p className="text-muted-foreground text-lg">
          Words of light to keep with you when the night feels too heavy.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="bg-card/30 border-border/50 h-[200px]">
              <CardContent className="p-6 h-full flex flex-col justify-center gap-4">
                <Skeleton className="h-6 w-full bg-primary/5" />
                <Skeleton className="h-6 w-4/5 bg-primary/5" />
                <Skeleton className="h-4 w-1/3 bg-primary/5 mt-4" />
              </CardContent>
            </Card>
          ))
        ) : (
          affirmations?.map((affirmation, i) => (
            <Card 
              key={affirmation.id} 
              className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 fill-mode-both group flex flex-col"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardContent className="p-8 flex-1 flex flex-col justify-center text-center relative overflow-hidden">
                {/* Decorative glows on hover */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {affirmation.category === "Night" ? (
                  <Moon className="w-4 h-4 text-primary/30 absolute top-4 left-4" />
                ) : (
                  <Sparkles className="w-4 h-4 text-primary/30 absolute top-4 left-4" />
                )}

                <blockquote className="text-xl font-serif text-foreground leading-relaxed mb-6">
                  "{affirmation.text}"
                </blockquote>
                
                {affirmation.author && (
                  <cite className="text-sm text-primary/70 font-medium uppercase tracking-widest mt-auto">
                    — {affirmation.author}
                  </cite>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
