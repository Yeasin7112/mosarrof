import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

const ComplaintForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    subject: "",
    details: "",
    is_private: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.mobile || !form.address || !form.details) {
      toast({
        title: "ত্রুটি",
        description: "মোবাইল নম্বর, ঠিকানা এবং বিস্তারিত অবশ্যই পূরণ করুন।",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("complaints").insert({
      name: form.name || null,
      mobile: form.mobile,
      email: form.email || null,
      address: form.address,
      subject: form.subject || null,
      details: form.details,
      is_private: form.is_private,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "ত্রুটি হয়েছে",
        description: "আপনার মতামত পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
        <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
        <h3 className="mb-2 text-2xl font-bold text-foreground">ধন্যবাদ!</h3>
        <p className="text-muted-foreground">
          আপনার মতামত সফলভাবে পাঠানো হয়েছে। এমপি মহোদয়ের টিম শীঘ্রই এটি পর্যালোচনা করবেন।
        </p>
        <Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: "", mobile: "", email: "", address: "", subject: "", details: "", is_private: false }); }}>
          আরেকটি মতামত পাঠান
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">নাম (ঐচ্ছিক)</Label>
          <Input
            id="name"
            placeholder="আপনার নাম (চাইলে ফাঁকা রাখতে পারেন)"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">
            মোবাইল নম্বর <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobile"
            placeholder="সক্রিয় মোবাইল নম্বর লিখুন"
            value={form.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
          <Input
            id="email"
            type="email"
            placeholder="আপনার ইমেইল (যদি থাকে)"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">
            ঠিকানা / এলাকা <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address"
            placeholder="গ্রাম/মহল্লা, ইউনিয়ন/ওয়ার্ড, উপজেলা"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">অভিযোগ / মতামতের বিষয়</Label>
        <Input
          id="subject"
          placeholder="সংক্ষেপে বিষয় লিখুন (যেমন: রাস্তা সমস্যা, স্বাস্থ্য)"
          value={form.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">
          বিস্তারিত অভিযোগ / মতামত <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="details"
          placeholder="আপনার সমস্যার বিস্তারিত লিখুন—কবে থেকে, কাদের বেশি কষ্ট হচ্ছে, আগে কোথাও অভিযোগ করেছেন কি না ইত্যাদি।"
          rows={5}
          value={form.details}
          onChange={(e) => handleChange("details", e.target.value)}
          required
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
        <Checkbox
          id="privacy"
          checked={form.is_private}
          onCheckedChange={(checked) => handleChange("is_private", checked as boolean)}
        />
        <Label htmlFor="privacy" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">
          আমার নাম ও যোগাযোগের তথ্য জনসম্মুখে প্রকাশ না করার অনুরোধ করছি।
        </Label>
      </div>

      <Button type="submit" size="lg" className="w-full gap-2 text-base" disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        মতামত পাঠান
      </Button>
    </form>
  );
};

export default ComplaintForm;
