
-- 1. User roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Only admins can read user_roles
CREATE POLICY "Admins can read user_roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Update complaints policies - admins can read and update
DROP POLICY IF EXISTS "No public read access" ON public.complaints;

CREATE POLICY "Admins can read complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update complaints"
  ON public.complaints FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Site content table for dynamic pages
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read site content (public pages)
CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  USING (true);

-- Admins can update site content
CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Seed default site content
INSERT INTO public.site_content (section_key, title, content, metadata) VALUES
('mp_profile', 'এবিএম মোশাররফ হোসেন', 'সংসদ সদস্য, ১১৪ পটুয়াখালী-৪ আসন, ত্রয়োদশ জাতীয় সংসদ', '{"constituency": "১১৪ পটুয়াখালী-৪", "area": "গলাচিপা, রাঙ্গাবালী উপজেলা", "party": "জনগণের প্রতিনিধি হিসেবে নির্বাচিত", "education": "বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে", "experience": "বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে"}'::jsonb),
('promises', 'এই মেয়াদের অঙ্গীকার', 'পটুয়াখালী-৪ আসনের জনগণের জন্য এবিএম মোশাররফ হোসেন এর প্রতিশ্রুতিসমূহ', '{"items": ["নদীভাঙন ও বন্যা-নিরাপত্তা নিশ্চিতকরণ", "উন্নত স্বাস্থ্যসেবা — স্থানীয় পর্যায়ে চিকিৎসা সুবিধা বৃদ্ধি", "শিক্ষা, দক্ষতা ও নারীর ক্ষমতায়ন", "কৃষি ও মৎস্য খাতে আধুনিকায়ন", "সবুজ পরিবেশ ও টেকসই উন্নয়ন", "ডিজিটাল ও স্মার্ট জনসেবা নিশ্চিতকরণ", "যোগাযোগ ব্যবস্থা ও রাস্তাঘাট উন্নয়ন", "যুব সমাজের কর্মসংস্থান সৃষ্টি"]}'::jsonb),
('contact', 'যোগাযোগ', '', '{"parliament_office": "জাতীয় সংসদ ভবন, শেরে বাংলা নগর, ঢাকা-১২০৭", "local_office": "গলাচিপা, পটুয়াখালী", "phone": "শীঘ্রই যোগ করা হবে", "email": "শীঘ্রই যোগ করা হবে", "office_hours": "রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০"}'::jsonb),
('hero', 'আপনার এমপি''কে লিখুন', 'আপনার এলাকার যেকোনো সমস্যা, অভিযোগ, প্রস্তাব বা পরামর্শ সরাসরি এবিএম মোশাররফ হোসেন ও তাঁর টিমকে জানাতে এই ফর্মটি ব্যবহার করুন।', '{}'::jsonb);
