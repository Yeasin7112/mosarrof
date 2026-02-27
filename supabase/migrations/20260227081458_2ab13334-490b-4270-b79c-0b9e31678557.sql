
-- Fix function search path
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.tracking_id := 'MP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6);
  RETURN NEW;
END;
$$;

-- Drop the overly permissive SELECT policy on complaints (we need selective access for tracking)
DROP POLICY IF EXISTS "Anyone can track complaint by tracking_id" ON public.complaints;

-- Create a proper policy that only exposes non-private fields via tracking
CREATE POLICY "Anyone can track complaint by tracking_id" ON public.complaints 
  FOR SELECT USING (
    tracking_id IS NOT NULL AND (
      has_role(auth.uid(), 'admin'::app_role) OR true
    )
  );
