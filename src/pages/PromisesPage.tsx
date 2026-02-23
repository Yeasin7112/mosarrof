import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const promises = [
  "নদীভাঙন ও বন্যা-নিরাপত্তা নিশ্চিতকরণ",
  "উন্নত স্বাস্থ্যসেবা — স্থানীয় পর্যায়ে চিকিৎসা সুবিধা বৃদ্ধি",
  "শিক্ষা, দক্ষতা ও নারীর ক্ষমতায়ন",
  "কৃষি ও মৎস্য খাতে আধুনিকায়ন",
  "সবুজ পরিবেশ ও টেকসই উন্নয়ন",
  "ডিজিটাল ও স্মার্ট জনসেবা নিশ্চিতকরণ",
  "যোগাযোগ ব্যবস্থা ও রাস্তাঘাট উন্নয়ন",
  "যুব সমাজের কর্মসংস্থান সৃষ্টি",
];

const PromisesPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              এই মেয়াদের অঙ্গীকার
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">
              হোম » অঙ্গীকারসমূহ
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-8 text-center text-lg text-muted-foreground">
              পটুয়াখালী-৪ আসনের জনগণের জন্য এবিএম মোশাররফ হোসেন এর প্রতিশ্রুতিসমূহ
            </p>
            <div className="space-y-4">
              {promises.map((promise, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/30"
                >
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                  <span className="text-foreground font-medium">{promise}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PromisesPage;
