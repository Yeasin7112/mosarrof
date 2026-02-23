import { Link } from "react-router-dom";
import { Facebook, Youtube, Mail, Phone } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Footer = () => {
  const { data: footerData } = useSiteContent("footer");
  const meta = (footerData?.metadata || {}) as Record<string, string>;

  return (
    <footer className="hero-gradient text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Info */}
          <div>
            <h3 className="mb-3 text-xl font-bold">এবিএম মোশাররফ হোসেন</h3>
            <p className="text-sm text-primary-foreground/80">
              সংসদ সদস্য, ১১৪ পটুয়াখালী-৪
            </p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              ত্রয়োদশ জাতীয় সংসদ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-lg font-semibold">দ্রুত লিংক</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground transition-colors">হোম</Link>
              <Link to="/profile" className="hover:text-primary-foreground transition-colors">প্রার্থী পরিচিতি</Link>
              <Link to="/write" className="hover:text-primary-foreground transition-colors">এমপি'কে লিখুন</Link>
              <Link to="/contact" className="hover:text-primary-foreground transition-colors">যোগাযোগ</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-lg font-semibold">যোগাযোগ</h4>
            <div className="flex gap-3">
              {meta.facebook && (
                <a href={meta.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20">
                  <Facebook size={18} />
                </a>
              )}
              {meta.youtube && (
                <a href={meta.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20">
                  <Youtube size={18} />
                </a>
              )}
              {meta.email && (
                <a href={`mailto:${meta.email}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20">
                  <Mail size={18} />
                </a>
              )}
              {meta.phone && (
                <a href={`tel:${meta.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20">
                  <Phone size={18} />
                </a>
              )}
              {!meta.facebook && !meta.youtube && !meta.email && !meta.phone && (
                <>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"><Facebook size={18} /></a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"><Youtube size={18} /></a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/60">
          <p>© ২০২৬ আপনার এমপি'কে লিখুন। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="mt-2">
            কারিগরি সহায়তায়{" "}
            <a
              href={meta.developer_facebook || "https://www.facebook.com/helloYeasin007"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/80 underline hover:text-primary-foreground transition-colors"
            >
              {meta.developer_name || "ইয়াছিন আরাফাত শাওন"}
            </a>
          </p>
          <Link to="/login" className="mt-3 inline-block text-xs text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors">
            অ্যাডমিন লগইন
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
