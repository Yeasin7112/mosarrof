import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mpPhoto from "@/assets/mp-photo.jpeg";

const navItems = [
  { label: "হোম", path: "/" },
  { label: "প্রার্থী পরিচিতি", path: "/profile" },
  { label: "অঙ্গীকারসমূহ", path: "/promises" },
  { label: "স্বচ্ছতা বোর্ড", path: "/transparency" },
  { label: "সাফল্যের গল্প", path: "/success-stories" },
  { label: "সাক্ষাৎ বুকিং", path: "/appointment" },
  { label: "যোগাযোগ", path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={mpPhoto} alt="এমপি" className="h-10 w-10 rounded-full object-cover border-2 border-primary" />
          <span className="hidden text-lg font-bold text-foreground sm:inline-block">
            আপনার এমপি'কে লিখুন
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/write">
            <Button className="ml-2" size="sm">এমপি'কে লিখুন</Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/write">
            <Button size="sm">এমপি'কে লিখুন</Button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-foreground hover:bg-accent"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="animate-fade-in border-t bg-card lg:hidden">
          <nav className="container flex flex-col py-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/tracking"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-primary hover:bg-accent"
            >
              🔍 অভিযোগ ট্র্যাকিং
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
