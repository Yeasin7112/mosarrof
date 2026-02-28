-- Fix: Drop RESTRICTIVE policies and recreate as PERMISSIVE

-- site_content: public read
DROP POLICY IF EXISTS "Anyone can read site content" ON public.site_content;
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);

-- complaints: public read for tracking
DROP POLICY IF EXISTS "Anyone can track complaint by tracking_id" ON public.complaints;
CREATE POLICY "Anyone can track complaint by tracking_id" ON public.complaints FOR SELECT USING (true);

-- complaints: public insert
DROP POLICY IF EXISTS "Anyone can submit a complaint" ON public.complaints;
CREATE POLICY "Anyone can submit a complaint" ON public.complaints FOR INSERT WITH CHECK (true);

-- appointments: public insert
DROP POLICY IF EXISTS "Anyone can book appointment" ON public.appointments;
CREATE POLICY "Anyone can book appointment" ON public.appointments FOR INSERT WITH CHECK (true);

-- success_stories: public read published
DROP POLICY IF EXISTS "Anyone can read published stories" ON public.success_stories;
CREATE POLICY "Anyone can read published stories" ON public.success_stories FOR SELECT USING ((is_published = true) OR has_role(auth.uid(), 'admin'::app_role));

-- Admin policies also need to be permissive
DROP POLICY IF EXISTS "Admins can read complaints" ON public.complaints;
CREATE POLICY "Admins can read complaints" ON public.complaints FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update complaints" ON public.complaints;
CREATE POLICY "Admins can update complaints" ON public.complaints FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can read appointments" ON public.appointments;
CREATE POLICY "Admins can read appointments" ON public.appointments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update appointments" ON public.appointments;
CREATE POLICY "Admins can update appointments" ON public.appointments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update site content" ON public.site_content;
CREATE POLICY "Admins can update site content" ON public.site_content FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert site content" ON public.site_content;
CREATE POLICY "Admins can insert site content" ON public.site_content FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete site content" ON public.site_content;
CREATE POLICY "Admins can delete site content" ON public.site_content FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update stories" ON public.success_stories;
CREATE POLICY "Admins can update stories" ON public.success_stories FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert stories" ON public.success_stories;
CREATE POLICY "Admins can insert stories" ON public.success_stories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete stories" ON public.success_stories;
CREATE POLICY "Admins can delete stories" ON public.success_stories FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;
CREATE POLICY "Admins can read user_roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));