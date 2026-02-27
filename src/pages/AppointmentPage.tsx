import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle2, Loader2 } from "lucide-react";

const AppointmentPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", purpose: "",
    preferred_date: "", preferred_time: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.purpose || !form.preferred_date) {
      toast({ title: "ত্রুটি", description: "নাম, মোবাইল, উদ্দেশ্য ও তারিখ আবশ্যক।", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      name: form.name,
      mobile: form.mobile,
      email: form.email || null,
      purpose: form.purpose,
      preferred_date: form.preferred_date,
      preferred_time: form.preferred_time || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "ত্রুটি হয়েছে", description: "আবার চেষ্টা করুন।", variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              এমপির সাথে সাক্ষাৎ বুকিং
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">আপনার সুবিধামতো সময়ে সাক্ষাতের সময় নির্ধারণ করুন</p>
          </div>
        </section>

        <section className="container py-10">
          <div className="mx-auto max-w-lg rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-up">
                <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
                <h3 className="mb-2 text-2xl font-bold text-foreground">বুকিং সম্পন্ন!</h3>
                <p className="text-muted-foreground">
                  আপনার সাক্ষাতের অনুরোধ পাঠানো হয়েছে। এমপি অফিস থেকে নিশ্চিতকরণ জানানো হবে।
                </p>
                <Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: "", mobile: "", email: "", purpose: "", preferred_date: "", preferred_time: "" }); }}>
                  আরেকটি বুকিং করুন
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>নাম <span className="text-destructive">*</span></Label>
                    <Input placeholder="আপনার নাম" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>মোবাইল <span className="text-destructive">*</span></Label>
                    <Input placeholder="মোবাইল নম্বর" value={form.mobile} onChange={(e) => handleChange("mobile", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ইমেইল (ঐচ্ছিক)</Label>
                  <Input type="email" placeholder="আপনার ইমেইল" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>সাক্ষাতের উদ্দেশ্য <span className="text-destructive">*</span></Label>
                  <Textarea placeholder="কেন আপনি এমপির সাথে দেখা করতে চান..." rows={3} value={form.purpose} onChange={(e) => handleChange("purpose", e.target.value)} required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>পছন্দের তারিখ <span className="text-destructive">*</span></Label>
                    <Input type="date" value={form.preferred_date} onChange={(e) => handleChange("preferred_date", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>পছন্দের সময়</Label>
                    <Input type="time" value={form.preferred_time} onChange={(e) => handleChange("preferred_time", e.target.value)} />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calendar className="h-5 w-5" />}
                  বুকিং করুন
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentPage;
