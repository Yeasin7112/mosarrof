import { MessageSquareText, ShieldCheck, Clock, Users } from "lucide-react";

const features = [
  {
    icon: MessageSquareText,
    title: "সরাসরি মতামত দিন",
    description: "আপনার সমস্যা, অভিযোগ বা পরামর্শ সরাসরি এমপি'র কাছে পৌঁছে যাবে।",
  },
  {
    icon: ShieldCheck,
    title: "গোপনীয়তা রক্ষা",
    description: "চাইলে আপনার পরিচয় গোপন রাখতে পারবেন। আমরা আপনার তথ্য সুরক্ষিত রাখি।",
  },
  {
    icon: Clock,
    title: "দ্রুত পর্যালোচনা",
    description: "প্রতিটি বার্তা গুরুত্বসহকারে পর্যালোচনা করা হবে এবং প্রয়োজনে ব্যবস্থা নেওয়া হবে।",
  },
  {
    icon: Users,
    title: "জনগণের কণ্ঠস্বর",
    description: "এই প্ল্যাটফর্ম জনগণ ও জনপ্রতিনিধির মধ্যে সেতুবন্ধন তৈরি করবে।",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            কেন এই প্ল্যাটফর্ম?
          </h2>
          <p className="mt-3 text-muted-foreground">
            আপনার কণ্ঠস্বর গুরুত্বপূর্ণ। আমরা নিশ্চিত করতে চাই প্রতিটি মতামত পৌঁছায়।
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
