import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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
import { LogOut, MessageSquare, Settings, RefreshCw, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type Complaint = Tables<"complaints">;
type SiteContent = Tables<"site_content">;

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"complaints" | "content">("complaints");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(0);

  const fetchComplaints = async () => {
    setLoading(true);
    let query = supabase
      .from("complaints")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error, count } = await query;
    if (!error) {
      setComplaints(data || []);
      setTotalComplaints(count || 0);
    }
    setLoading(false);
  };

  const fetchContents = async () => {
    const { data } = await supabase
      .from("site_content")
      .select("*")
      .order("section_key");
    setContents(data || []);
  };

  useEffect(() => {
    fetchComplaints();
    fetchContents();
  }, [page, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("complaints")
      .update({ status })
      .eq("id", id);
    if (!error) {
      toast({ title: "স্ট্যাটাস আপডেট হয়েছে" });
      fetchComplaints();
      setSelectedComplaint(null);
    }
  };

  const saveContent = async () => {
    if (!editingContent) return;
    const { error } = await supabase
      .from("site_content")
      .update({
        title: editingContent.title,
        content: editingContent.content,
        metadata: editingContent.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingContent.id);
    if (!error) {
      toast({ title: "কন্টেন্ট আপডেট হয়েছে" });
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
      fetchContents();
      setEditingContent(null);
    }
  };

  const statusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      pending: "bg-secondary text-secondary-foreground",
      reviewed: "bg-accent text-accent-foreground",
      resolved: "bg-primary/10 text-primary",
    };
    const labels: Record<string, string> = {
      pending: "অপেক্ষমান",
      reviewed: "পর্যালোচিত",
      resolved: "সমাধান",
    };
    const s = status || "pending";
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[s] || ""}`}>
        {labels[s] || s}
      </span>
    );
  };

  const totalPages = Math.ceil(totalComplaints / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
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

      <div className="container py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === "complaints" ? "default" : "outline"}
            onClick={() => setActiveTab("complaints")}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" /> মতামত সমূহ ({totalComplaints})
          </Button>
          <Button
            variant={activeTab === "content" ? "default" : "outline"}
            onClick={() => setActiveTab("content")}
            className="gap-2"
          >
            <Settings className="h-4 w-4" /> সাইট কন্টেন্ট
          </Button>
        </div>

        {/* Complaints Tab */}
        {activeTab === "complaints" && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="সব স্ট্যাটাস" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                  <SelectItem value="pending">অপেক্ষমান</SelectItem>
                  <SelectItem value="reviewed">পর্যালোচিত</SelectItem>
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
                        <div className="flex items-center gap-2 mb-1">
                          {statusBadge(c.status)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.created_at).toLocaleDateString("bn-BD")}
                          </span>
                        </div>
                        <p className="font-medium text-foreground truncate">
                          {c.subject || "বিষয় উল্লেখ নেই"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{c.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.is_private ? "🔒 গোপনীয়" : ""} {c.name || "বেনামী"} · {c.address}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(c)} className="gap-1 shrink-0">
                        <Eye className="h-4 w-4" /> বিস্তারিত
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
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

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-3">
            {contents.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">{c.section_key}</span>
                    <p className="font-medium text-foreground">{c.title}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditingContent({ ...c })}>
                    সম্পাদনা
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>মতামতের বিস্তারিত</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">নাম:</span> <span className="font-medium">{selectedComplaint.name || "বেনামী"}</span></div>
                <div><span className="text-muted-foreground">মোবাইল:</span> <span className="font-medium">{selectedComplaint.mobile}</span></div>
                <div><span className="text-muted-foreground">ইমেইল:</span> <span className="font-medium">{selectedComplaint.email || "—"}</span></div>
                <div><span className="text-muted-foreground">ঠিকানা:</span> <span className="font-medium">{selectedComplaint.address}</span></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">বিষয়:</p>
                <p className="font-medium">{selectedComplaint.subject || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">বিস্তারিত:</p>
                <p className="text-sm whitespace-pre-wrap">{selectedComplaint.details}</p>
              </div>
              <div className="flex items-center gap-3">
                <Label>স্ট্যাটাস:</Label>
                <Select
                  value={selectedComplaint.status || "pending"}
                  onValueChange={(v) => updateStatus(selectedComplaint.id, v)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">অপেক্ষমান</SelectItem>
                    <SelectItem value="reviewed">পর্যালোচিত</SelectItem>
                    <SelectItem value="resolved">সমাধান</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Content Edit Dialog */}
      <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>কন্টেন্ট সম্পাদনা — {editingContent?.section_key}</DialogTitle>
          </DialogHeader>
          {editingContent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>শিরোনাম</Label>
                <Input
                  value={editingContent.title || ""}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>বিবরণ</Label>
                <Textarea
                  rows={3}
                  value={editingContent.content || ""}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>মেটাডেটা (JSON)</Label>
                <Textarea
                  rows={8}
                  className="font-mono text-xs"
                  value={JSON.stringify(editingContent.metadata || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditingContent({ ...editingContent, metadata: parsed });
                    } catch {
                      // allow invalid JSON while typing
                    }
                  }}
                />
              </div>
              <Button onClick={saveContent} className="w-full">সংরক্ষণ করুন</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
