import { useGetUserStats } from "@workspace/api-client-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Flame, BookOpen, Shield, Trophy, Target } from "lucide-react";

export default function Stats() {
  const { data: stats, isLoading } = useGetUserStats();

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  // Ensure we have some safe defaults if stats are empty
  const s = stats || {
    totalFears: 0,
    resolvedFears: 0,
    unresolvedFears: 0,
    totalJournalEntries: 0,
    averageFearIntensity: 0,
    currentStreak: 0,
    longestStreak: 0,
    progressPercentage: 0
  };

  const pieData = [
    { name: "Resolved", value: s.resolvedFears, color: "hsl(var(--emerald-500, 150 80% 40%))" },
    { name: "Active", value: s.unresolvedFears, color: "hsl(var(--destructive))" },
  ];

  const barData = [
    { name: "Fears", count: s.totalFears },
    { name: "Journals", count: s.totalJournalEntries },
    { name: "Resolved", count: s.resolvedFears },
  ];

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          The Journey
        </h1>
        <p className="text-muted-foreground text-lg">Every step forward is recorded here.</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        <Card className="bg-card/40 border-border/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-serif">{s.progressPercentage}%</p>
            <p className="text-sm text-muted-foreground mt-1">Resolution Rate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/40 border-border/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-serif">{s.longestStreak}</p>
            <p className="text-sm text-muted-foreground mt-1">Longest Streak</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/40 border-border/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-serif">{s.averageFearIntensity.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground mt-1">Avg Intensity (1-10)</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-serif">{s.totalJournalEntries}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
        <Card className="bg-card/40 border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">Shadows vs Light</CardTitle>
            <CardDescription>Ratio of resolved to active fears</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {s.totalFears === 0 ? (
              <p className="text-muted-foreground">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          <div className="flex justify-center gap-6 pb-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-emerald-500" /> Resolved ({s.resolvedFears})
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-destructive" /> Active ({s.unresolvedFears})
            </div>
          </div>
        </Card>

        <Card className="bg-card/40 border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">Activity Overview</CardTitle>
            <CardDescription>Total counts across the sanctuary</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
