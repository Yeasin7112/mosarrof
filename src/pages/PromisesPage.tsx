import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const PromisesPage = () => {
  const { data: promisesData } = useSiteContent("promises");
  const meta = (promisesData?.metadata || {}) as { items?: string[] };
  const promises = meta.items || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              {promisesData?.title || "এই মেয়াদের অঙ্গীকার"}
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">
              হোম » অঙ্গীকারসমূহ
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-8 text-center text-lg text-muted-foreground">
              {promisesData?.content || ""}
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
