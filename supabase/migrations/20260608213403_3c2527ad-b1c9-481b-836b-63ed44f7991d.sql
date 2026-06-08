CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium',
  likelihood TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  framework TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_assessments TO authenticated;
GRANT ALL ON public.risk_assessments TO service_role;

ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own risks"
  ON public.risk_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own risks"
  ON public.risk_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own risks"
  ON public.risk_assessments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own risks"
  ON public.risk_assessments FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER risk_assessments_set_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();