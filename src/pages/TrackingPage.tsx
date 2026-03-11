import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, Clock, Eye, Forward, Loader2 } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/constants";

const STATUS_STEPS = [
  { key: "pending", label: "🟡 জমা হয়েছে", icon: Clock, desc: "আপনার অভিযোগ সফলভাবে জমা পড়েছে" },
  { key: "reviewed", label: "🔵 পর্যালোচনাধীন", icon: Eye, desc: "এমপি মহোদয়ের টিম পর্যালোচনা করছেন" },
  { key: "forwarded", label: "🟣 কর্তৃপক্ষে প্রেরিত", icon: Forward, desc: "সংশ্লিষ্ট কর্তৃপক্ষে পাঠানো হয়েছে" },
  { key: "resolved", label: "✅ সমাধান হয়েছে", icon: CheckCircle2, desc: "সমস্যাটি সমাধান করা হয়েছে" },
];

const TrackingPage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setComplaint(null);

    const { data, error } = await supabase
      .from("complaints")
      .select("tracking_id, category, urgency, status, created_at, subject, is_private, union_ward, admin_notes")
      .ilike("tracking_id", trackingId.trim())
      .maybeSingle();

    setLoading(false);
    if (error || !data) {
      setNotFound(true);
    } else {
      setComplaint(data);
    }
  };

  const currentStep = STATUS_STEPS.findIndex((s) => s.key === (complaint?.status || "pending"));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              অভিযোগ ট্র্যাকিং
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">আপনার অভিযোগের বর্তমান অবস্থা দেখুন</p>
          </div>
        </section>

        <section className="container py-10">
          <div className="mx-auto max-w-lg">
            <div className="flex gap-2">
              <Input
                placeholder="আপনার ট্র্যাকিং আইডি লিখুন (যেমন: MP-20260227-abc123)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="text-base"
              />
              <Button onClick={handleSearch} disabled={loading} className="gap-2 shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                খুঁজুন
              </Button>
            </div>

            {notFound && (
              <div className="mt-8 rounded-xl border bg-destructive/5 p-6 text-center">
                <p className="text-destructive font-medium">এই ট্র্যাকিং আইডিতে কোনো অভিযোগ পাওয়া যায়নি।</p>
                <p className="text-sm text-muted-foreground mt-2">আইডি সঠিকভাবে লিখেছেন কিনা দেখুন।</p>
              </div>
            )}

            {complaint && (
              <div className="mt-8 space-y-6 animate-fade-up">
                {/* Info card */}
                <div className="rounded-xl border bg-card p-5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">ট্র্যাকিং আইডি</p>
                      <p className="font-bold text-primary">{complaint.tracking_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">তারিখ</p>
                      <p className="font-medium">{new Date(complaint.created_at).toLocaleDateString("bn-BD")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ক্যাটাগরি</p>
                      <p className="font-medium">{complaint.category || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">এলাকা</p>
                      <p className="font-medium">{complaint.union_ward || "—"}</p>
                    </div>
                  </div>
                  {complaint.subject && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">বিষয়</p>
                      <p className="font-medium">{complaint.subject}</p>
                    </div>
                  )}
                </div>

                {/* Status timeline */}
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-4">অবস্থা</h3>
                  <div className="space-y-0">
                    {STATUS_STEPS.map((step, i) => {
                      const isActive = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={step.key} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                              isActive ? "border-primary bg-primary/10" : "border-border bg-muted"
                            } ${isCurrent ? "ring-2 ring-primary/30" : ""}`}>
                              <step.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`w-0.5 h-8 ${isActive ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                          <div className="pb-8">
                            <p className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                              {step.label}
                            </p>
                            <p className="text-xs text-muted-foreground">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Admin notes */}
                {complaint.admin_notes && (
                  <div className="rounded-xl border bg-accent/30 p-5">
                    <p className="text-sm font-medium text-foreground">এমপি অফিসের মন্তব্য:</p>
                    <p className="text-sm text-muted-foreground mt-1">{complaint.admin_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrackingPage;
