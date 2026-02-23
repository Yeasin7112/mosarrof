import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplaintForm from "@/components/ComplaintForm";

const WritePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero banner */}
        <section className="hero-gradient py-12 md:py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              আপনার এমপি'কে লিখুন
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-sm">
              হোম » আপনার এমপি'কে লিখুন
            </p>
          </div>
        </section>

        {/* Intro text */}
        <section className="container py-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-lg leading-relaxed text-foreground">
              আপনার এলাকার যেকোনো সমস্যা, অভিযোগ, প্রস্তাব বা পরামর্শ সরাসরি{" "}
              <strong>এবিএম মোশাররফ হোসেন</strong> ও তাঁর টিমকে জানাতে এই ফর্মটি ব্যবহার করুন।{" "}
              <span className="text-destructive font-medium">
                আপনার তথ্য গোপন রাখা হবে (যদি আপনি চান) এবং প্রতিটি বার্তা গুরুত্বসহকারে পর্যালোচনা করা হবে।
              </span>
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="container pb-16">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            <ComplaintForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WritePage;
