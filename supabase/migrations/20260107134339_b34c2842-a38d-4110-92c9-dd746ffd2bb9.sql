-- Create member_contacts table for offline member registration
-- This allows leaders to register members without requiring them to accept invites

CREATE TABLE public.member_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipe_id UUID NOT NULL REFERENCES public.equipes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'active')),
  user_id UUID, -- NULL until member creates account and claims
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (equipe_id, email) -- Prevent duplicate emails per team
);

-- Enable RLS
ALTER TABLE public.member_contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Leaders can manage member_contacts of their team
CREATE POLICY "Lideres can manage member_contacts of their equipe"
ON public.member_contacts
FOR ALL
USING (user_is_lider_of_equipe(auth.uid(), equipe_id));

-- Policy: Organizadores can view member_contacts
CREATE POLICY "Organizadores can view member_contacts"
ON public.member_contacts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.equipes e
    JOIN public.igrejas i ON i.id = e.igreja_id
    WHERE e.id = member_contacts.equipe_id
    AND i.organizador_id = auth.uid()
  )
);

-- Policy: Members can view their own contact record
CREATE POLICY "Members can view their own contact"
ON public.member_contacts
FOR SELECT
USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_member_contacts_updated_at
BEFORE UPDATE ON public.member_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_member_contacts_equipe ON public.member_contacts(equipe_id);
CREATE INDEX idx_member_contacts_email ON public.member_contacts(email);
CREATE INDEX idx_member_contacts_user_id ON public.member_contacts(user_id) WHERE user_id IS NOT NULL;