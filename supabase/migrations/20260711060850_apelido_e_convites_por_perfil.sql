-- Add "apelido" (nickname / "como quer ser chamado") to profiles, used as the
-- preferred display name across the app when filled in.
ALTER TABLE public.profiles ADD COLUMN apelido text;

-- Restrict who can create which type of convite:
-- liderIgreja (organizador) can only invite liderEquipe (lider),
-- liderEquipe (lider) can only invite membroEquipe (membro).
-- Previously the only check was convidado_por = auth.uid(), so any
-- authenticated user could create a convite of any tipo for any igreja/equipe.
DROP POLICY IF EXISTS "Organizadores and Lideres can create convites" ON public.convites;

CREATE POLICY "Organizador convida lider, lider convida membro"
    ON public.convites FOR INSERT
    TO authenticated
    WITH CHECK (
        convidado_por = auth.uid()
        AND (
            (tipo = 'lider' AND EXISTS (
                SELECT 1 FROM public.igrejas
                WHERE id = igreja_id AND organizador_id = auth.uid()
            ))
            OR
            (tipo = 'membro' AND equipe_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.equipes
                WHERE id = equipe_id AND lider_id = auth.uid()
            ))
        )
    );
