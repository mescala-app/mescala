-- Fix overly permissive RLS policy for notificacoes table

-- Drop the permissive policy
DROP POLICY IF EXISTS "System can create notificacoes" ON public.notificacoes;

-- Create more restrictive policy - only lideres/organizadores can create notifications
-- or edge functions with service role
CREATE POLICY "Lideres can create notificacoes for their equipe members"
    ON public.notificacoes FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.escalas e
            JOIN public.escala_membros em ON em.escala_id = e.id
            WHERE em.user_id = notificacoes.user_id
            AND public.user_is_lider_of_equipe(auth.uid(), e.equipe_id)
        )
        OR user_id = auth.uid()
    );