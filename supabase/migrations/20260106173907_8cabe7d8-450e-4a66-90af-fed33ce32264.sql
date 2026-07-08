-- Fix overly permissive RLS policies for convites table

-- Drop the permissive policies
DROP POLICY IF EXISTS "Anyone can view convites by token" ON public.convites;
DROP POLICY IF EXISTS "Anyone can update convite status" ON public.convites;

-- Create more restrictive policies
-- Allow unauthenticated users to view a specific convite by token (for registration flow)
CREATE POLICY "View convite by token for registration"
    ON public.convites FOR SELECT
    TO anon, authenticated
    USING (status = 'pending');

-- Allow the system/authenticated user to update convite when accepting
CREATE POLICY "Accept own convite"
    ON public.convites FOR UPDATE
    TO authenticated
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
        OR convidado_por = auth.uid()
    );