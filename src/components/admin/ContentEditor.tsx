import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type SiteContent = Tables<"site_content">;

// Define the fields for each section so we render proper forms
const SECTION_CONFIGS: Record<string, {
  label: string;
  fields: { key: string; label: string; type: "text" | "textarea" | "url" | "email" | "tel"; placeholder?: string; isMetadata?: boolean }[];
  listField?: { key: string; label: string; addLabel: string };
}> = {
  hero: {
    label: "হোম পেজ হিরো সেকশন",
    fields: [
      { key: "title", label: "শিরোনাম", type: "text", placeholder: "আপনার এমপি'কে লিখুন" },
      { key: "content", label: "বিবরণ", type: "textarea", placeholder: "হিরো সেকশনের বিবরণ লিখুন" },
    ],
  },
  mp_profile: {
    label: "এমপি পরিচিতি পেজ",
    fields: [
      { key: "title", label: "নাম / শিরোনাম", type: "text", placeholder: "এবিএম মোশাররফ হোসেন" },
      { key: "content", label: "জীবনী / বিবরণ", type: "textarea", placeholder: "এমপির সংক্ষিপ্ত জীবনী লিখুন" },
      { key: "constituency", label: "নির্বাচনী এলাকা", type: "text", placeholder: "১১৪ পটুয়াখালী-৪", isMetadata: true },
      { key: "area", label: "এলাকা", type: "text", placeholder: "গলাচিপা, দশমিনা", isMetadata: true },
      { key: "party", label: "দল", type: "text", placeholder: "বাংলাদেশ আওয়ামী লীগ", isMetadata: true },
      { key: "education", label: "শিক্ষাগত যোগ্যতা", type: "text", placeholder: "স্নাতকোত্তর", isMetadata: true },
      { key: "experience", label: "অভিজ্ঞতা", type: "text", placeholder: "প্রাক্তন চেয়ারম্যান", isMetadata: true },
    ],
  },
  promises: {
    label: "অঙ্গীকার পেজ",
    fields: [
      { key: "title", label: "শিরোনাম", type: "text", placeholder: "এই মেয়াদের অঙ্গীকার" },
      { key: "content", label: "বিবরণ", type: "textarea", placeholder: "অঙ্গীকারের বিবরণ" },
    ],
    listField: { key: "items", label: "অঙ্গীকার তালিকা", addLabel: "নতুন অঙ্গীকার যোগ করুন" },
  },
  contact: {
    label: "যোগাযোগ পেজ",
    fields: [
      { key: "title", label: "শিরোনাম", type: "text", placeholder: "যোগাযোগ" },
      { key: "content", label: "বিবরণ", type: "textarea", placeholder: "যোগাযোগের বিবরণ" },
      { key: "parliament_office", label: "সংসদ অফিস ঠিকানা", type: "text", placeholder: "জাতীয় সংসদ ভবন, ঢাকা", isMetadata: true },
      { key: "local_office", label: "স্থানীয় অফিস ঠিকানা", type: "text", placeholder: "গলাচিপা, পটুয়াখালী", isMetadata: true },
      { key: "phone", label: "ফোন নম্বর", type: "tel", placeholder: "০১XXXXXXXXX", isMetadata: true },
      { key: "email", label: "ইমেইল", type: "email", placeholder: "email@example.com", isMetadata: true },
      { key: "office_hours", label: "অফিস সময়", type: "text", placeholder: "রবি-বৃহঃ সকাল ১০টা - বিকাল ৫টা", isMetadata: true },
    ],
  },
  footer: {
    label: "ফুটার সেকশন",
    fields: [
      { key: "title", label: "শিরোনাম", type: "text", placeholder: "ফুটার" },
      { key: "content", label: "বিবরণ", type: "textarea", placeholder: "ফুটারের বিবরণ" },
      { key: "facebook", label: "ফেসবুক লিংক", type: "url", placeholder: "https://facebook.com/...", isMetadata: true },
      { key: "youtube", label: "ইউটিউব লিংক", type: "url", placeholder: "https://youtube.com/...", isMetadata: true },
      { key: "email", label: "ইমেইল", type: "email", placeholder: "email@example.com", isMetadata: true },
      { key: "phone", label: "ফোন নম্বর", type: "tel", placeholder: "০১XXXXXXXXX", isMetadata: true },
      { key: "developer_name", label: "ডেভেলপারের নাম", type: "text", placeholder: "ইয়াছিন আরাফাত শাওন", isMetadata: true },
      { key: "developer_facebook", label: "ডেভেলপারের ফেসবুক", type: "url", placeholder: "https://facebook.com/...", isMetadata: true },
    ],
  },
};

interface ContentEditorProps {
  content: SiteContent;
  onBack: () => void;
}

const ContentEditor = ({ content, onBack }: ContentEditorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const config = SECTION_CONFIGS[content.section_key];

  // Form state
  const [title, setTitle] = useState(content.title || "");
  const [contentText, setContentText] = useState(content.content || "");
  const [meta, setMeta] = useState<Record<string, any>>((content.metadata || {}) as Record<string, any>);
  const [listItems, setListItems] = useState<string[]>([]);

  useEffect(() => {
    setTitle(content.title || "");
    setContentText(content.content || "");
    const m = (content.metadata || {}) as Record<string, any>;
    setMeta(m);
    if (config?.listField) {
      setListItems(Array.isArray(m[config.listField.key]) ? m[config.listField.key] : []);
    }
  }, [content]);

  const updateMeta = (key: string, value: string) => {
    setMeta(prev => ({ ...prev, [key]: value }));
  };

  const addListItem = () => {
    setListItems(prev => [...prev, ""]);
  };

  const updateListItem = (index: number, value: string) => {
    setListItems(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeListItem = (index: number) => {
    setListItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const finalMeta = { ...meta };
    if (config?.listField) {
      finalMeta[config.listField.key] = listItems.filter(item => item.trim() !== "");
    }

    const { error } = await supabase
      .from("site_content")
      .update({
        title,
        content: contentText,
        metadata: finalMeta,
        updated_at: new Date().toISOString(),
      })
      .eq("id", content.id);

    setSaving(false);
    if (!error) {
      toast({ title: "✅ সফলভাবে সংরক্ষণ হয়েছে!" });
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
    } else {
      toast({ title: "❌ সংরক্ষণে সমস্যা হয়েছে", variant: "destructive" });
    }
  };

  // Fallback for unknown sections
  if (!config) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> ফিরে যান
        </Button>
        <p className="text-muted-foreground">এই সেকশনের জন্য এডিটর পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> ফিরে যান
        </Button>
        <h2 className="text-lg font-bold text-foreground">{config.label}</h2>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        {config.fields.map((field) => {
          const value = field.isMetadata
            ? (meta[field.key] || "")
            : field.key === "title" ? title : contentText;

          const onChange = (val: string) => {
            if (field.isMetadata) {
              updateMeta(field.key, val);
            } else if (field.key === "title") {
              setTitle(val);
            } else {
              setContentText(val);
            }
          };

          return (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-medium">{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : (
                <Input
                  type={field.type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          );
        })}

        {/* List field (e.g. promises) */}
        {config.listField && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{config.listField.label}</Label>
            {listItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateListItem(index, e.target.value)}
                  placeholder={`অঙ্গীকার ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeListItem(index)}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addListItem} className="gap-2">
              <Plus className="h-4 w-4" /> {config.listField.addLabel}
            </Button>
          </div>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
          <Save className="h-4 w-4" />
          {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
