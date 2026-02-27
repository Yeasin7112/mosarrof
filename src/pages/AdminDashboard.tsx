import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LogOut, MessageSquare, Settings, RefreshCw, Eye, ChevronLeft, ChevronRight,
  FileText, Calendar, Trophy, BarChart3, AlertTriangle, Mic, Paperclip,
  Plus, Trash2, Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContentEditor from "@/components/admin/ContentEditor";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const ITEMS_PER_PAGE = 10;

const SECTION_LABELS: Record<string, string> = {
  hero: "🏠 হোম পেজ হিরো",
  mp_profile: "👤 এমপি পরিচিতি",
  promises: "📋 অঙ্গীকারসমূহ",
  contact: "📞 যোগাযোগ",
  footer: "🔗 ফুটার ও সোশ্যাল মিডিয়া",
};

const CATEGORY_LABELS: Record<string, string> = {
  road: "রাস্তা", electricity: "বিদ্যুৎ", education: "শিক্ষা",
  health: "স্বাস্থ্য", water: "পানি", land: "ভূমি",
  corruption: "দুর্নীতি", other: "অন্যান্য",
};

const COLORS = ["hsl(45, 80%, 55%)", "hsl(160, 100%, 20%)", "hsl(200, 80%, 50%)", "hsl(0, 84%, 60%)", "hsl(280, 60%, 50%)"];

type Tab = "complaints" | "content" | "appointments" | "stories" | "reports";

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("complaints");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [editingStory, setEditingStory] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [adminNotes, setAdminNotes] = useState("");

  // Reports state
  const [reportData, setReportData] = useState<any>(null);

  const fetchComplaints = async () => {
    setLoading(true);
    let query = supabase
      .from("complaints")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { data, count } = await query;
    setComplaints(data || []);
    setTotalComplaints(count || 0);
    setLoading(false);
  };

  const fetchContents = async () => {
    const { data } = await supabase.from("site_content").select("*").order("section_key");
    setContents(data || []);
  };

  const fetchAppointments = async () => {
    const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
    setAppointments(data || []);
  };

  const fetchStories = async () => {
    const { data } = await supabase.from("success_stories").select("*").order("created_at", { ascending: false });
    setStories(data || []);
  };

  const fetchReports = async () => {
    const { data: all } = await supabase.from("complaints").select("status, category, union_ward, urgency, created_at");
    if (!all) return;

    const total = all.length;
    const resolved = all.filter(c => c.status === "resolved").length;
    const emergency = all.filter(c => c.urgency === "emergency").length;

    const catMap: Record<string, number> = {};
    all.forEach(c => { const cat = c.category || "other"; catMap[cat] = (catMap[cat] || 0) + 1; });
    const categoryData = Object.entries(catMap).map(([k, v]) => ({ name: CATEGORY_LABELS[k] || k, count: v })).sort((a, b) => b.count - a.count);

    const unionMap: Record<string, number> = {};
    all.forEach(c => { if (c.union_ward) unionMap[c.union_ward] = (unionMap[c.union_ward] || 0) + 1; });
    const unionData = Object.entries(unionMap).map(([k, v]) => ({ name: k, count: v })).sort((a, b) => b.count - a.count);

    const monthMap: Record<string, { total: number; resolved: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthMap[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`] = { total: 0, resolved: 0 };
    }
    all.forEach(c => {
      const d = new Date(c.created_at);
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      if (monthMap[k]) { monthMap[k].total++; if (c.status === "resolved") monthMap[k].resolved++; }
    });
    const monthNames = ["জানু","ফেব","মার্চ","এপ্রি","মে","জুন","জুলা","আগ","সেপ্টে","অক্টো","নভে","ডিসে"];
    const monthlyData = Object.entries(monthMap).map(([k, v]) => ({
      month: monthNames[parseInt(k.split("-")[1]) - 1], ...v,
    }));

    setReportData({ total, resolved, emergency, categoryData, unionData, monthlyData });
  };

  useEffect(() => {
    fetchComplaints();
    fetchContents();
    fetchAppointments();
    fetchStories();
    fetchReports();
  }, [page, statusFilter]);

  const updateComplaintStatus = async (id: string, status: string) => {
    await supabase.from("complaints").update({ status }).eq("id", id);
    toast({ title: "স্ট্যাটাস আপডেট হয়েছে" });
    fetchComplaints();
    setSelectedComplaint(null);
  };

  const updateAdminNotes = async (id: string) => {
    await supabase.from("complaints").update({ admin_notes: adminNotes }).eq("id", id);
    toast({ title: "মন্তব্য সংরক্ষিত" });
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    toast({ title: "আপডেট হয়েছে" });
    fetchAppointments();
  };

  const saveStory = async () => {
    if (!editingStory) return;
    const isNew = !editingStory.id;
    if (isNew) {
      await supabase.from("success_stories").insert(editingStory);
    } else {
      await supabase.from("success_stories").update(editingStory).eq("id", editingStory.id);
    }
    toast({ title: "সংরক্ষিত!" });
    setEditingStory(null);
    fetchStories();
  };

  const deleteStory = async (id: string) => {
    await supabase.from("success_stories").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetchStories();
  };

  const statusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      pending: "bg-secondary text-secondary-foreground",
      reviewed: "bg-accent text-accent-foreground",
      forwarded: "bg-primary/20 text-primary",
      resolved: "bg-primary/10 text-primary",
    };
    const labels: Record<string, string> = {
      pending: "অপেক্ষমান", reviewed: "পর্যালোচিত", forwarded: "প্রেরিত", resolved: "সমাধান",
      confirmed: "নিশ্চিত", cancelled: "বাতিল",
    };
    const s = status || "pending";
    return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[s] || "bg-muted text-muted-foreground"}`}>{labels[s] || s}</span>;
  };

  const totalPages = Math.ceil(totalComplaints / ITEMS_PER_PAGE);

  // Content editor view
  if (editingContent) {
    return (
      <div className="min-h-screen bg-muted/30">
        <AdminHeader user={user} signOut={signOut} navigate={navigate} />
        <div className="container py-6">
          <ContentEditor content={editingContent} onBack={() => { setEditingContent(null); fetchContents(); }} />
        </div>
      </div>
    );
  }

  // Story editor dialog
  const storyDialog = editingStory && (
    <Dialog open={!!editingStory} onOpenChange={() => setEditingStory(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{editingStory.id ? "গল্প সম্পাদনা" : "নতুন সাফল্যের গল্প"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>শিরোনাম</Label>
            <Input value={editingStory.title || ""} onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })} placeholder="সাফল্যের শিরোনাম" />
          </div>
          <div className="space-y-2">
            <Label>বিবরণ</Label>
            <Textarea value={editingStory.description || ""} onChange={(e) => setEditingStory({ ...editingStory, description: e.target.value })} rows={4} placeholder="বিস্তারিত লিখুন" />
          </div>
          <div className="space-y-2">
            <Label>ক্যাটাগরি</Label>
            <Input value={editingStory.category || ""} onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })} placeholder="রাস্তা, স্বাস্থ্য, শিক্ষা..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>আগের ছবি (URL)</Label>
              <Input value={editingStory.before_image || ""} onChange={(e) => setEditingStory({ ...editingStory, before_image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>পরের ছবি (URL)</Label>
              <Input value={editingStory.after_image || ""} onChange={(e) => setEditingStory({ ...editingStory, after_image: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Label>প্রকাশিত?</Label>
            <Select value={editingStory.is_published ? "true" : "false"} onValueChange={(v) => setEditingStory({ ...editingStory, is_published: v === "true" })}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">হ্যাঁ</SelectItem>
                <SelectItem value="false">না</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={saveStory} className="w-full gap-2"><Save className="h-4 w-4" /> সংরক্ষণ করুন</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader user={user} signOut={signOut} navigate={navigate} />

      <div className="container py-6">
        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: "complaints" as Tab, icon: MessageSquare, label: `মতামত (${totalComplaints})` },
            { key: "appointments" as Tab, icon: Calendar, label: `সাক্ষাৎ (${appointments.length})` },
            { key: "stories" as Tab, icon: Trophy, label: "সাফল্যের গল্প" },
            { key: "content" as Tab, icon: Settings, label: "সাইট কন্টেন্ট" },
            { key: "reports" as Tab, icon: BarChart3, label: "রিপোর্ট" },
          ].map(tab => (
            <Button key={tab.key} variant={activeTab === tab.key ? "default" : "outline"} onClick={() => setActiveTab(tab.key)} className="gap-2" size="sm">
              <tab.icon className="h-4 w-4" /> {tab.label}
            </Button>
          ))}
        </div>

        {/* COMPLAINTS TAB */}
        {activeTab === "complaints" && (
          <div>
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="সব স্ট্যাটাস" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                  <SelectItem value="pending">অপেক্ষমান</SelectItem>
                  <SelectItem value="reviewed">পর্যালোচিত</SelectItem>
                  <SelectItem value="forwarded">প্রেরিত</SelectItem>
                  <SelectItem value="resolved">সমাধান</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchComplaints} className="gap-1">
                <RefreshCw className="h-4 w-4" /> রিফ্রেশ
              </Button>
            </div>

            {loading ? (
              <p className="text-muted-foreground py-8 text-center">লোড হচ্ছে...</p>
            ) : complaints.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">কোনো মতামত পাওয়া যায়নি</p>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div key={c.id} className="rounded-xl border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {statusBadge(c.status)}
                          {c.urgency === "emergency" && (
                            <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> জরুরি</Badge>
                          )}
                          {c.urgency === "urgent" && <Badge variant="secondary">জরুরি</Badge>}
                          {c.voice_url && <Badge variant="outline" className="gap-1"><Mic className="h-3 w-3" /> ভয়েস</Badge>}
                          {c.attachment_url && <Badge variant="outline" className="gap-1"><Paperclip className="h-3 w-3" /> ফাইল</Badge>}
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.created_at).toLocaleDateString("bn-BD")}
                          </span>
                        </div>
                        <p className="font-medium text-foreground truncate">
                          {c.subject || "বিষয় উল্লেখ নেই"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{c.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.is_private ? "🔒" : ""} {c.name || "বেনামী"} · {c.address}
                          {c.tracking_id && <span className="ml-2 text-primary font-mono">{c.tracking_id}</span>}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => { setSelectedComplaint(c); setAdminNotes(c.admin_notes || ""); }} className="gap-1 shrink-0">
                        <Eye className="h-4 w-4" /> বিস্তারিত
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">কোনো বুকিং পাওয়া যায়নি</p>
            ) : appointments.map(a => (
              <div key={a.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(a.status)}
                      <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("bn-BD")}</span>
                    </div>
                    <p className="font-medium text-foreground">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.purpose}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      📅 {a.preferred_date} {a.preferred_time && `⏰ ${a.preferred_time}`} · 📱 {a.mobile}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Select value={a.status || "pending"} onValueChange={(v) => updateAppointmentStatus(a.id, v)}>
                      <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">অপেক্ষমান</SelectItem>
                        <SelectItem value="confirmed">নিশ্চিত</SelectItem>
                        <SelectItem value="cancelled">বাতিল</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STORIES TAB */}
        {activeTab === "stories" && (
          <div className="space-y-4">
            <Button onClick={() => setEditingStory({ title: "", description: "", category: "", before_image: "", after_image: "", is_published: false })} className="gap-2">
              <Plus className="h-4 w-4" /> নতুন সাফল্যের গল্প যোগ করুন
            </Button>
            {stories.map(s => (
              <div key={s.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={s.is_published ? "default" : "outline"}>
                        {s.is_published ? "প্রকাশিত" : "খসড়া"}
                      </Badge>
                      {s.category && <Badge variant="secondary">{s.category}</Badge>}
                    </div>
                    <p className="font-medium text-foreground">{s.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{s.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setEditingStory({ ...s })}>সম্পাদনা</Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteStory(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="space-y-3">
            {contents.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-5 cursor-pointer transition-colors hover:border-primary/40" onClick={() => setEditingContent({ ...c })}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{SECTION_LABELS[c.section_key] || c.section_key}</p>
                      <p className="text-sm text-muted-foreground">{c.title || "শিরোনাম নেই"}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">সম্পাদনা করুন</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && reportData && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-foreground">{reportData.total}</p>
                  <p className="text-sm text-muted-foreground">মোট অভিযোগ</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary">{reportData.resolved}</p>
                  <p className="text-sm text-muted-foreground">সমাধান হয়েছে</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-destructive">{reportData.emergency}</p>
                  <p className="text-sm text-muted-foreground">জরুরি অভিযোগ</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-lg">মাসিক অভিযোগ</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="hsl(160, 100%, 20%)" name="মোট" radius={[4,4,0,0]} />
                      <Bar dataKey="resolved" fill="hsl(45, 80%, 55%)" name="সমাধান" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">সমস্যার ধরন</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={reportData.categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                        {reportData.categoryData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Most problematic unions */}
            <Card>
              <CardHeader><CardTitle className="text-lg">সর্বাধিক অভিযোগপ্রাপ্ত এলাকা</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportData.unionData.slice(0, 10).map((u: any, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
                      <span className="text-sm font-medium">{u.name}</span>
                      <Badge variant="secondary">{u.count} টি অভিযোগ</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>মতামতের বিস্তারিত</DialogTitle></DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              {selectedComplaint.tracking_id && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">ট্র্যাকিং আইডি</p>
                  <code className="text-lg font-bold text-primary">{selectedComplaint.tracking_id}</code>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">নাম:</span> <span className="font-medium">{selectedComplaint.name || "বেনামী"}</span></div>
                <div><span className="text-muted-foreground">মোবাইল:</span> <span className="font-medium">{selectedComplaint.mobile}</span></div>
                <div><span className="text-muted-foreground">ইমেইল:</span> <span className="font-medium">{selectedComplaint.email || "—"}</span></div>
                <div><span className="text-muted-foreground">ঠিকানা:</span> <span className="font-medium">{selectedComplaint.address}</span></div>
                <div><span className="text-muted-foreground">ক্যাটাগরি:</span> <span className="font-medium">{CATEGORY_LABELS[selectedComplaint.category] || selectedComplaint.category || "—"}</span></div>
                <div><span className="text-muted-foreground">এলাকা:</span> <span className="font-medium">{selectedComplaint.union_ward || "—"}</span></div>
                <div><span className="text-muted-foreground">জরুরিতা:</span> <span className="font-medium">{selectedComplaint.urgency || "normal"}</span></div>
                <div><span className="text-muted-foreground">গোপনীয়তা:</span> <span className="font-medium">{selectedComplaint.is_private ? "🔒 হ্যাঁ" : "না"}</span></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">বিষয়:</p>
                <p className="font-medium">{selectedComplaint.subject || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">বিস্তারিত:</p>
                <p className="text-sm whitespace-pre-wrap">{selectedComplaint.details}</p>
              </div>

              {selectedComplaint.attachment_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">📎 সংযুক্ত ফাইল:</p>
                  <a href={selectedComplaint.attachment_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">ফাইল দেখুন</a>
                </div>
              )}
              {selectedComplaint.voice_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">🎤 ভয়েস মেসেজ:</p>
                  <audio controls src={selectedComplaint.voice_url} className="w-full" />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Label>স্ট্যাটাস:</Label>
                <Select value={selectedComplaint.status || "pending"} onValueChange={(v) => updateComplaintStatus(selectedComplaint.id, v)}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">অপেক্ষমান</SelectItem>
                    <SelectItem value="reviewed">পর্যালোচিত</SelectItem>
                    <SelectItem value="forwarded">কর্তৃপক্ষে প্রেরিত</SelectItem>
                    <SelectItem value="resolved">সমাধান</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>অ্যাডমিন মন্তব্য (জনগণ দেখতে পাবে)</Label>
                <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} placeholder="এখানে মন্তব্য লিখুন..." />
                <Button size="sm" onClick={() => updateAdminNotes(selectedComplaint.id)} className="gap-1">
                  <Save className="h-4 w-4" /> মন্তব্য সংরক্ষণ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {storyDialog}
    </div>
  );
};

// Admin header sub-component
const AdminHeader = ({ user, signOut, navigate }: { user: any; signOut: () => void; navigate: (path: string) => void }) => (
  <header className="border-b bg-card">
    <div className="container flex h-14 items-center justify-between">
      <h1 className="text-lg font-bold text-foreground">অ্যাডমিন ড্যাশবোর্ড</h1>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>সাইটে যান</Button>
        <Button variant="outline" size="sm" onClick={signOut} className="gap-1">
          <LogOut className="h-4 w-4" /> লগআউট
        </Button>
      </div>
    </div>
  </header>
);

export default AdminDashboard;
