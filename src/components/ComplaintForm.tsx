import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, CheckCircle2, Loader2, Upload, Mic, MicOff, AlertTriangle, Copy } from "lucide-react";

const CATEGORIES = [
  { value: "road", label: "🛣️ রাস্তা / যোগাযোগ" },
  { value: "electricity", label: "💡 বিদ্যুৎ" },
  { value: "education", label: "📚 শিক্ষা" },
  { value: "health", label: "🏥 স্বাস্থ্য" },
  { value: "water", label: "💧 পানি / স্যানিটেশন" },
  { value: "land", label: "🏞️ ভূমি সমস্যা" },
  { value: "corruption", label: "⚖️ দুর্নীতি / অনিয়ম" },
  { value: "other", label: "📝 অন্যান্য" },
];

const UNIONS = [
  "গলাচিপা সদর", "দক্ষিণ গলাচিপা", "উত্তর গলাচিপা", "পানপট্টি",
  "চিকনিকান্দি", "গোলখালী", "আমখোলা", "রতনদী-১", "রতনদী-২",
  "দশমিনা সদর", "বহরমপুর", "চরামতা", "বাঁশবাড়িয়া",
  "অন্যান্য",
];

const URGENCY_LEVELS = [
  { value: "normal", label: "🟢 সাধারণ", desc: "নিয়মিত সমস্যা" },
  { value: "urgent", label: "🟡 জরুরি", desc: "দ্রুত সমাধান দরকার" },
  { value: "emergency", label: "🔴 জরুরি সাহায্য", desc: "তাৎক্ষণিক পদক্ষেপ প্রয়োজন" },
];

const ComplaintForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    subject: "",
    details: "",
    is_private: false,
    category: "other",
    union_ward: "",
    urgency: "normal",
  });
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      setRecording(true);
    } catch {
      toast({ title: "মাইক্রোফোন ব্যবহার করা যাচ্ছে না", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const uploadFile = async (file: Blob, prefix: string): Promise<string | null> => {
    const ext = file instanceof File ? file.name.split(".").pop() : "webm";
    const path = `${prefix}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("complaint-attachments").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("complaint-attachments").getPublicUrl(path);
    return data.publicUrl;
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

    let attachmentUrl: string | null = null;
    let voiceUrl: string | null = null;

    if (attachment) {
      attachmentUrl = await uploadFile(attachment, "photos");
    }
    if (audioBlob) {
      voiceUrl = await uploadFile(audioBlob, "voice");
    }

    const { data, error } = await supabase.from("complaints").insert({
      name: form.name || null,
      mobile: form.mobile,
      email: form.email || null,
      address: form.address,
      subject: form.subject || null,
      details: form.details,
      is_private: form.is_private,
      category: form.category,
      union_ward: form.union_ward || null,
      urgency: form.urgency,
      is_emergency: form.urgency === "emergency",
      attachment_url: attachmentUrl,
      voice_url: voiceUrl,
    }).select("tracking_id").single();

    setLoading(false);

    if (error) {
      toast({
        title: "ত্রুটি হয়েছে",
        description: "আপনার মতামত পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } else {
      setTrackingId(data?.tracking_id || "");
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
        {trackingId && (
          <div className="mt-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-6 w-full max-w-sm">
            <p className="text-sm text-muted-foreground mb-2">আপনার ট্র্যাকিং আইডি:</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-2xl font-bold text-primary">{trackingId}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(trackingId);
                  toast({ title: "কপি হয়েছে!" });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              এই আইডি দিয়ে আপনি যেকোনো সময় আপনার অভিযোগের অবস্থা দেখতে পারবেন।
            </p>
          </div>
        )}
        <Button
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setTrackingId("");
            setAttachment(null);
            setAudioBlob(null);
            setForm({
              name: "", mobile: "", email: "", address: "", subject: "",
              details: "", is_private: false, category: "other", union_ward: "", urgency: "normal",
            });
          }}
        >
          আরেকটি মতামত পাঠান
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Category & Urgency */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>সমস্যার ধরন <span className="text-destructive">*</span></Label>
          <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger><SelectValue placeholder="সমস্যার ধরন বাছাই করুন" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>জরুরিতা</Label>
          <Select value={form.urgency} onValueChange={(v) => handleChange("urgency", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {URGENCY_LEVELS.map((u) => (
                <SelectItem key={u.value} value={u.value}>{u.label} — {u.desc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Emergency warning */}
      {form.urgency === "emergency" && (
        <div className="flex items-center gap-3 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive font-medium">
            জরুরি সাহায্যের অনুরোধ অগ্রাধিকার ভিত্তিতে পর্যালোচনা করা হবে।
          </p>
        </div>
      )}

      {/* Union/Ward */}
      <div className="space-y-2">
        <Label>ইউনিয়ন / ওয়ার্ড / এলাকা</Label>
        <Select value={form.union_ward} onValueChange={(v) => handleChange("union_ward", v)}>
          <SelectTrigger><SelectValue placeholder="আপনার এলাকা বাছাই করুন" /></SelectTrigger>
          <SelectContent>
            {UNIONS.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Name & Mobile */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">নাম (ঐচ্ছিক)</Label>
          <Input id="name" placeholder="আপনার নাম" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">মোবাইল নম্বর <span className="text-destructive">*</span></Label>
          <Input id="mobile" placeholder="সক্রিয় মোবাইল নম্বর" value={form.mobile} onChange={(e) => handleChange("mobile", e.target.value)} required />
        </div>
      </div>

      {/* Email & Address */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
          <Input id="email" type="email" placeholder="আপনার ইমেইল" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">ঠিকানা <span className="text-destructive">*</span></Label>
          <Input id="address" placeholder="গ্রাম/মহল্লা, ইউনিয়ন/ওয়ার্ড" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject">অভিযোগ / মতামতের বিষয়</Label>
        <Input id="subject" placeholder="সংক্ষেপে বিষয় লিখুন" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} />
      </div>

      {/* Details */}
      <div className="space-y-2">
        <Label htmlFor="details">বিস্তারিত অভিযোগ / মতামত <span className="text-destructive">*</span></Label>
        <Textarea id="details" placeholder="আপনার সমস্যার বিস্তারিত লিখুন..." rows={5} value={form.details} onChange={(e) => handleChange("details", e.target.value)} required />
      </div>

      {/* Voice Recording */}
      <div className="space-y-2">
        <Label>🎤 ভয়েস মেসেজ (টাইপ না করে কথায় বলুন)</Label>
        <div className="flex items-center gap-3">
          {recording ? (
            <Button type="button" variant="destructive" onClick={stopRecording} className="gap-2">
              <MicOff className="h-4 w-4" /> রেকর্ড বন্ধ করুন
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={startRecording} className="gap-2">
              <Mic className="h-4 w-4" /> রেকর্ড শুরু করুন
            </Button>
          )}
          {audioBlob && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">✅ রেকর্ড হয়েছে</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setAudioBlob(null)}>মুছুন</Button>
            </div>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>📎 ছবি / ডকুমেন্ট সংযুক্ত করুন</Label>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => setAttachment(e.target.files?.[0] || null)}
        />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
          <Upload className="h-4 w-4" /> ফাইল নির্বাচন করুন
        </Button>
        {attachment && <p className="text-sm text-primary">📄 {attachment.name}</p>}
      </div>

      {/* Privacy */}
      <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
        <Checkbox id="privacy" checked={form.is_private} onCheckedChange={(checked) => handleChange("is_private", checked as boolean)} />
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
