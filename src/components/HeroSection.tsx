import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenLine, UserCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import parliamentBuilding from "@/assets/parliament-building.jpg";

const HeroSection = () => {
  const { data: hero } = useSiteContent("hero");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={parliamentBuilding} alt="জাতীয় সংসদ ভবন" className="h-full w-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/90 backdrop-blur-sm border border-primary-foreground/20">
              ত্রয়োদশ জাতীয় সংসদ · পটুয়াখালী-৪ (রাঙ্গাবালী, কলাপাড়া)
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {hero?.title || "আপনার এমপি'কে লিখুন"}
          </h1>

          <p className="mt-4 text-lg text-primary-foreground/80 md:text-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {hero?.content || "আপনার এলাকার যেকোনো সমস্যা, অভিযোগ, প্রস্তাব বা পরামর্শ সরাসরি এবিএম মোশাররফ হোসেন ও তাঁর টিমকে জানাতে এই ফর্মটি ব্যবহার করুন।"}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/write">
              <Button size="lg" variant="secondary" className="gap-2 text-base font-semibold">
                <PenLine className="h-5 w-5" />
                এমপি'কে লিখুন
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="lg" variant="outline" className="gap-2 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <UserCircle className="h-5 w-5" />
                প্রার্থী পরিচিতি
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
