
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  company_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- onboarding
CREATE TABLE public.onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  team_size text NOT NULL,
  compliance_framework text NOT NULL,
  systems text[] NOT NULL DEFAULT '{}',
  target_date text NOT NULL,
  contact_role text NOT NULL,
  additional_info text,
  profile_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding TO authenticated;
GRANT ALL ON public.onboarding TO service_role;
ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own onboarding data" ON public.onboarding FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own onboarding data" ON public.onboarding FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own onboarding data" ON public.onboarding FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER trg_onboarding_updated_at BEFORE UPDATE ON public.onboarding FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- compliance_status
CREATE TABLE public.compliance_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_percentage integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT progress_percentage_range CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compliance_status TO authenticated;
GRANT ALL ON public.compliance_status TO service_role;
ALTER TABLE public.compliance_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own compliance status" ON public.compliance_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own compliance status" ON public.compliance_status FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_compliance_status_updated_at BEFORE UPDATE ON public.compliance_status FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- policies
CREATE TABLE public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  framework text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.policies TO authenticated;
GRANT ALL ON public.policies TO service_role;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own policies" ON public.policies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own policies" ON public.policies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own policies" ON public.policies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own policies" ON public.policies FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- tasks
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid REFERENCES public.policies(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  due_date timestamptz,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- evidence
CREATE TABLE public.evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_path text,
  file_type text,
  file_size integer,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evidence TO authenticated;
GRANT ALL ON public.evidence TO service_role;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own evidence" ON public.evidence FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_evidence_updated_at BEFORE UPDATE ON public.evidence FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- integrations
CREATE TABLE public.integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  service_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrations TO authenticated;
GRANT ALL ON public.integrations TO service_role;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own integrations" ON public.integrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own integrations" ON public.integrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own integrations" ON public.integrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own integrations" ON public.integrations FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_integrations_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- team_members
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  name text,
  role text NOT NULL DEFAULT 'viewer',
  status text NOT NULL DEFAULT 'invited',
  invited_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their team members" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage team members they invited" ON public.team_members FOR ALL USING (invited_by = auth.uid()) WITH CHECK (invited_by = auth.uid());
CREATE TRIGGER trg_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'company');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- evidence bucket policies
CREATE POLICY "Users can view their own evidence files" ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload their own evidence files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own evidence files" ON storage.objects FOR UPDATE
  USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own evidence files" ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
