
-- Add new columns to complaints table
ALTER TABLE public.complaints 
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS union_ward text,
  ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS tracking_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS voice_url text,
  ADD COLUMN IF NOT EXISTS is_emergency boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- Function to generate tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tracking_id := 'MP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tracking_id
  BEFORE INSERT ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION generate_tracking_id();

-- Appointments table
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  email text,
  purpose text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text,
  status text DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can book appointment" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read appointments" ON public.appointments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update appointments" ON public.appointments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Success stories table
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  before_image text,
  after_image text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published stories" ON public.success_stories FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert stories" ON public.success_stories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update stories" ON public.success_stories FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete stories" ON public.success_stories FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('complaint-attachments', 'complaint-attachments', true);

-- Storage policies
CREATE POLICY "Anyone can upload attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'complaint-attachments');
CREATE POLICY "Anyone can view attachments" ON storage.objects FOR SELECT USING (bucket_id = 'complaint-attachments');
CREATE POLICY "Admins can delete attachments" ON storage.objects FOR DELETE USING (bucket_id = 'complaint-attachments' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow public tracking by tracking_id
CREATE POLICY "Anyone can track complaint by tracking_id" ON public.complaints FOR SELECT USING (tracking_id IS NOT NULL);
