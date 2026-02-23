import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, MapPin, Building2, GraduationCap } from "lucide-react";

const ProfilePage = () => {
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
            {/* MP Info Card */}
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-foreground">
                  এম
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">এবিএম মোশাররফ হোসেন</h2>
                  <p className="mt-1 text-muted-foreground">
                    সংসদ সদস্য, ১১৪ পটুয়াখালী-৪ আসন
                  </p>
                  <p className="text-muted-foreground">
                    ত্রয়োদশ জাতীয় সংসদ
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">নির্বাচনী এলাকা</h3>
                </div>
                <p className="text-muted-foreground">
                  ১১৪ পটুয়াখালী-৪ আসন — গলাচিপা, রাঙ্গাবালী উপজেলা
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">দল</h3>
                </div>
                <p className="text-muted-foreground">
                  জনগণের প্রতিনিধি হিসেবে নির্বাচিত
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">শিক্ষাগত যোগ্যতা</h3>
                </div>
                <p className="text-muted-foreground">
                  বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">অভিজ্ঞতা</h3>
                </div>
                <p className="text-muted-foreground">
                  বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে
                </p>
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
