
-- Fix complaints: drop restrictive SELECT policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can track complaint by tracking_id" ON public.complaints;
DROP POLICY IF EXISTS "Admins can read complaints" ON public.complaints;
DROP POLICY IF EXISTS "Anyone can submit a complaint" ON public.complaints;
DROP POLICY IF EXISTS "Admins can update complaints" ON public.complaints;

CREATE POLICY "Anyone can track complaint by tracking_id" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a complaint" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update complaints" ON public.complaints FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix site_content
DROP POLICY IF EXISTS "Anyone can read site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can update site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can delete site content" ON public.site_content;

CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can update site content" ON public.site_content FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert site content" ON public.site_content FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete site content" ON public.site_content FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix success_stories
DROP POLICY IF EXISTS "Anyone can read published stories" ON public.success_stories;
DROP POLICY IF EXISTS "Admins can update stories" ON public.success_stories;
DROP POLICY IF EXISTS "Admins can insert stories" ON public.success_stories;
DROP POLICY IF EXISTS "Admins can delete stories" ON public.success_stories;

CREATE POLICY "Anyone can read published stories" ON public.success_stories FOR SELECT USING ((is_published = true) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update stories" ON public.success_stories FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert stories" ON public.success_stories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete stories" ON public.success_stories FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix appointments
DROP POLICY IF EXISTS "Anyone can book appointment" ON public.appointments;
DROP POLICY IF EXISTS "Admins can read appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update appointments" ON public.appointments;

CREATE POLICY "Anyone can book appointment" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read appointments" ON public.appointments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update appointments" ON public.appointments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles
DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
