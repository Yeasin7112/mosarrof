import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await supabase
        .from("success_stories")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      setStories(data || []);
      setLoading(false);
    };
    fetchStories();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              সাফল্যের গল্প
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">
              জনগণের সমস্যা সমাধানের সফল উদাহরণ
            </p>
          </div>
        </section>

        <section className="container py-10">
          {loading ? (
            <p className="text-center text-muted-foreground py-10">লোড হচ্ছে...</p>
          ) : stories.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle2 className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">শীঘ্রই সাফল্যের গল্প যোগ করা হবে।</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  {/* Before/After images */}
                  {(story.before_image || story.after_image) && (
                    <div className="grid grid-cols-2 gap-0.5 bg-border">
                      {story.before_image && (
                        <div className="relative">
                          <img src={story.before_image} alt="আগে" className="h-40 w-full object-cover" />
                          <span className="absolute bottom-1 left-1 rounded bg-destructive/80 px-2 py-0.5 text-xs text-destructive-foreground">আগে</span>
                        </div>
                      )}
                      {story.after_image && (
                        <div className="relative">
                          <img src={story.after_image} alt="পরে" className="h-40 w-full object-cover" />
                          <span className="absolute bottom-1 left-1 rounded bg-primary/80 px-2 py-0.5 text-xs text-primary-foreground">পরে</span>
                        </div>
                      )}
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {story.category && <Badge variant="secondary">{story.category}</Badge>}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{story.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{story.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;
