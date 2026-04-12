
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update submissions"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete submissions"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
