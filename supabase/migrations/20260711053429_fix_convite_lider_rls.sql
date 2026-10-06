-- Fix RLS gap that blocked users from actually claiming their role when accepting an invite.
--
-- Bug: AceitarConvite.tsx tries to (1) insert a row into user_roles and (2) update
-- equipes.lider_id when a "lider" invite is accepted. Neither write had a matching RLS
-- policy: user_roles had no self-INSERT policy at all, and the only equipes UPDATE
-- policy required lider_id = auth.uid() to already be true (impossible on first claim).
-- Both writes were silently rejected, so leaders who accepted an invite were never
-- actually registered as lider of their equipe and got bounced out of /equipe/:id.

-- Allow a user to create their own user_roles row when accepting a matching pending invite.
CREATE POLICY "Users can create own role via pending invite"
    ON public.user_roles FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.convites c
            WHERE c.status = 'pending'
              AND c.tipo = user_roles.role
              AND c.igreja_id = user_roles.igreja_id
              AND c.equipe_id IS NOT DISTINCT FROM user_roles.equipe_id
              AND c.email = (SELECT email FROM public.profiles WHERE user_id = auth.uid())
        )
    );

-- Allow a user to claim lider_id on the equipe named in a matching pending "lider" invite.
-- (Combines via OR with the existing "Lideres can update their equipe" policy, which only
-- covers updates made by someone who is already lider_id.)
CREATE POLICY "Users can claim lider via pending invite"
    ON public.equipes FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.convites c
            WHERE c.status = 'pending'
              AND c.tipo = 'lider'
              AND c.equipe_id = equipes.id
              AND c.email = (SELECT email FROM public.profiles WHERE user_id = auth.uid())
        )
    )
    WITH CHECK (
        lider_id = auth.uid()
    );
