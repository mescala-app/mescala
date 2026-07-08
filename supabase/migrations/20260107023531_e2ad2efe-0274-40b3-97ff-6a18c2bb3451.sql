-- Allow public read of igreja nome for invite registration
CREATE POLICY "Public can view igreja nome for invites" 
ON public.igrejas 
FOR SELECT 
USING (true);

-- Allow public read of equipe nome for invite registration  
CREATE POLICY "Public can view equipe nome for invites"
ON public.equipes
FOR SELECT
USING (true);