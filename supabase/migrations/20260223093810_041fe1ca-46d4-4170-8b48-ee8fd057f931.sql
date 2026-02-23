
-- Create table for citizen complaints/opinions
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  mobile TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  subject TEXT,
  details TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit a complaint"
  ON public.complaints FOR INSERT
  WITH CHECK (true);

-- No public read access (only admin should see)
CREATE POLICY "No public read access"
  ON public.complaints FOR SELECT
  USING (false);
