import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, MapPin, Building2, GraduationCap } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import mpPhoto from "@/assets/mp-photo.jpeg";

const ProfilePage = () => {
  const { data: profile } = useSiteContent("mp_profile");
  const meta = (profile?.metadata || {}) as Record<string, string>;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              প্রার্থী পরিচিতি
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">
              হোম » প্রার্থী পরিচিতি
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <img
                  src={mpPhoto}
                  alt={profile?.title || "এবিএম মোশাররফ হোসেন"}
                  className="h-32 w-32 shrink-0 rounded-full object-cover border-4 border-primary/20"
                />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile?.title || "এবিএম মোশাররফ হোসেন"}
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    {profile?.content || "সংসদ সদস্য, ১১৪ পটুয়াখালী-৪ আসন"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">নির্বাচনী এলাকা</h3>
                </div>
                <p className="text-muted-foreground">
                  {meta.constituency || "১১৪ পটুয়াখালী-৪"} — {meta.area || "গলাচিপা, রাঙ্গাবালী উপজেলা"}
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">দল</h3>
                </div>
                <p className="text-muted-foreground">{meta.party || "জনগণের প্রতিনিধি"}</p>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">শিক্ষাগত যোগ্যতা</h3>
                </div>
                <p className="text-muted-foreground">{meta.education || "—"}</p>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">অভিজ্ঞতা</h3>
                </div>
                <p className="text-muted-foreground">{meta.experience || "—"}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
