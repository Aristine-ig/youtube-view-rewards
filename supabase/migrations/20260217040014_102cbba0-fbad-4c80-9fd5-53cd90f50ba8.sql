
-- Make video_url nullable with a default empty string so it's not required on insert
ALTER TABLE public.tasks ALTER COLUMN video_url SET DEFAULT '';
ALTER TABLE public.tasks ALTER COLUMN video_url DROP NOT NULL;

-- Create thumbnails storage bucket (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Allow authenticated users to upload thumbnails (admins only for insert)
CREATE POLICY "Admins can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails' AND public.has_role(auth.uid(), 'admin'));

-- Anyone can view thumbnails (public bucket)
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- Admins can delete thumbnails
CREATE POLICY "Admins can delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnails' AND public.has_role(auth.uid(), 'admin'));
