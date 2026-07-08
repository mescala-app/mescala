-- Add quantidade_suplentes column to equipes table
ALTER TABLE public.equipes 
ADD COLUMN quantidade_suplentes integer DEFAULT 0;