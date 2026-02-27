import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const COLORS = ["hsl(45, 80%, 55%)", "hsl(160, 100%, 20%)", "hsl(200, 80%, 50%)", "hsl(0, 84%, 60%)", "hsl(280, 60%, 50%)"];

const CATEGORY_LABELS: Record<string, string> = {
  road: "রাস্তা", electricity: "বিদ্যুৎ", education: "শিক্ষা",
  health: "স্বাস্থ্য", water: "পানি", land: "ভূমি",
  corruption: "দুর্নীতি", other: "অন্যান্য",
};

const TransparencyPage = () => {
  const [stats, setStats] = useState({
    total: 0, resolved: 0, pending: 0, reviewed: 0,
    categoryData: [] as { name: string; count: number }[],
    monthlyData: [] as { month: string; total: number; resolved: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: complaints } = await supabase
        .from("complaints")
        .select("status, category, created_at");

      if (!complaints) { setLoading(false); return; }

      const total = complaints.length;
      const resolved = complaints.filter(c => c.status === "resolved").length;
      const pending = complaints.filter(c => c.status === "pending").length;
      const reviewed = complaints.filter(c => c.status === "reviewed").length;

      // Category breakdown
      const catMap: Record<string, number> = {};
      complaints.forEach(c => {
        const cat = c.category || "other";
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      const categoryData = Object.entries(catMap).map(([key, count]) => ({
        name: CATEGORY_LABELS[key] || key, count,
      }));

      // Monthly data (last 6 months)
      const monthlyMap: Record<string, { total: number; resolved: number }> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap[key] = { total: 0, resolved: 0 };
      }
      complaints.forEach(c => {
        const d = new Date(c.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyMap[key]) {
          monthlyMap[key].total++;
          if (c.status === "resolved") monthlyMap[key].resolved++;
        }
      });
      const monthNames = ["জানু", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন", "জুলা", "আগ", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];
      const monthlyData = Object.entries(monthlyMap).map(([key, val]) => ({
        month: monthNames[parseInt(key.split("-")[1]) - 1],
        ...val,
      }));

      setStats({ total, resolved, pending, reviewed, categoryData, monthlyData });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              স্বচ্ছতা বোর্ড
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">জনগণের অভিযোগ সমাধানের অগ্রগতি</p>
          </div>
        </section>

        <section className="container py-10">
          {loading ? (
            <p className="text-center text-muted-foreground py-10">লোড হচ্ছে...</p>
          ) : (
            <div className="space-y-8">
              {/* Stats cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">মোট অভিযোগ</p>
                      <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">সমাধান হয়েছে</p>
                      <p className="text-3xl font-bold text-foreground">{stats.resolved}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30">
                      <Clock className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">অপেক্ষমান</p>
                      <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                      <TrendingUp className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">সমাধানের হার</p>
                      <p className="text-3xl font-bold text-foreground">{resolutionRate}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">মাসিক অভিযোগ ও সমাধান</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="hsl(160, 100%, 20%)" name="মোট" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="resolved" fill="hsl(45, 80%, 55%)" name="সমাধান" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">সমস্যার ধরন অনুযায়ী</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.categoryData}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.categoryData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TransparencyPage;
