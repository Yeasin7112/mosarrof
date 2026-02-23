import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const ContactPage = () => {
  const { data: contactData } = useSiteContent("contact");
  const meta = (contactData?.metadata || {}) as Record<string, string>;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              {contactData?.title || "যোগাযোগ"}
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">
              হোম » যোগাযোগ
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">অফিসের ঠিকানা</h3>
              </div>
              <p className="text-muted-foreground">{meta.parliament_office || "—"}</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">স্থানীয় অফিস</h3>
              </div>
              <p className="text-muted-foreground">{meta.local_office || "—"}</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">ফোন</h3>
              </div>
              <p className="text-muted-foreground">{meta.phone || "—"}</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">ইমেইল</h3>
              </div>
              <p className="text-muted-foreground">{meta.email || "—"}</p>
            </div>
            <div className="rounded-xl border bg-card p-6 sm:col-span-2">
              <div className="mb-3 flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">অফিস সময়</h3>
              </div>
              <p className="text-muted-foreground">{meta.office_hours || "—"}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
