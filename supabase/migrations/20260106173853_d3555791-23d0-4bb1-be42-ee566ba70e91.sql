-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('organizador', 'lider', 'membro');

-- Create enum for days of week
CREATE TYPE public.dia_semana AS ENUM ('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado');

-- Create enum for invite status
CREATE TYPE public.invite_status AS ENUM ('pending', 'accepted', 'expired');

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    nome_completo TEXT NOT NULL,
    data_nascimento DATE,
    email TEXT NOT NULL,
    whatsapp TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    igreja_id UUID, -- will reference igrejas table
    equipe_id UUID, -- will reference equipes table (for lider/membro)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role, igreja_id, equipe_id)
);

-- Create igrejas (churches) table
CREATE TABLE public.igrejas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    endereco TEXT,
    organizador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key to user_roles after igrejas exists
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_igreja_id_fkey FOREIGN KEY (igreja_id) REFERENCES public.igrejas(id) ON DELETE CASCADE;

-- Create eventos (services/events) table
CREATE TABLE public.eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    igreja_id UUID REFERENCES public.igrejas(id) ON DELETE CASCADE NOT NULL,
    nome TEXT DEFAULT 'Culto',
    dia_semana dia_semana NOT NULL,
    horario TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipes (teams) table
CREATE TABLE public.equipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    igreja_id UUID REFERENCES public.igrejas(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    lider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    quantidade_por_culto INTEGER DEFAULT 3,
    dia_formulario_ausencia dia_semana,
    horario_formulario_ausencia TIME,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key to user_roles after equipes exists
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_equipe_id_fkey FOREIGN KEY (equipe_id) REFERENCES public.equipes(id) ON DELETE CASCADE;

-- Create convites (invites) table
CREATE TABLE public.convites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    tipo app_role NOT NULL,
    igreja_id UUID REFERENCES public.igrejas(id) ON DELETE CASCADE NOT NULL,
    equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE,
    convidado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status invite_status NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ausencias (absences) table
CREATE TABLE public.ausencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE NOT NULL,
    data_ausencia DATE NOT NULL,
    motivo TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, equipe_id, data_ausencia)
);

-- Create escalas (schedules) table
CREATE TABLE public.escalas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE NOT NULL,
    evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE NOT NULL,
    data_escala DATE NOT NULL,
    gerada_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    gerada_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create escala_membros (schedule members) table
CREATE TABLE public.escala_membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escala_id UUID REFERENCES public.escalas(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    confirmado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (escala_id, user_id)
);

-- Create notificacoes (notifications) table
CREATE TABLE public.notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    escala_id UUID REFERENCES public.escalas(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- '1_dia', '12_horas', '1_hora', 'convite', 'ausencia'
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    enviada BOOLEAN DEFAULT false,
    agendada_para TIMESTAMP WITH TIME ZONE NOT NULL,
    enviada_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.igrejas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ausencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escala_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create function to check if user belongs to igreja
CREATE OR REPLACE FUNCTION public.user_belongs_to_igreja(_user_id UUID, _igreja_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND igreja_id = _igreja_id
    )
$$;

-- Create function to check if user is lider of equipe
CREATE OR REPLACE FUNCTION public.user_is_lider_of_equipe(_user_id UUID, _equipe_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.equipes
        WHERE id = _equipe_id
          AND lider_id = _user_id
    )
$$;

-- Create function to check if user belongs to equipe
CREATE OR REPLACE FUNCTION public.user_belongs_to_equipe(_user_id UUID, _equipe_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND equipe_id = _equipe_id
    )
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_igrejas_updated_at
    BEFORE UPDATE ON public.igrejas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipes_updated_at
    BEFORE UPDATE ON public.equipes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Organizadores can manage roles in their igreja"
    ON public.user_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.igrejas
            WHERE id = igreja_id AND organizador_id = auth.uid()
        )
    );

-- RLS Policies for igrejas
CREATE POLICY "Users can view igrejas they belong to"
    ON public.igrejas FOR SELECT
    USING (public.user_belongs_to_igreja(auth.uid(), id) OR organizador_id = auth.uid());

CREATE POLICY "Organizadores can update their igreja"
    ON public.igrejas FOR UPDATE
    USING (organizador_id = auth.uid());

CREATE POLICY "Authenticated users can create igrejas"
    ON public.igrejas FOR INSERT
    TO authenticated
    WITH CHECK (organizador_id = auth.uid());

-- RLS Policies for eventos
CREATE POLICY "Users can view eventos of their igreja"
    ON public.eventos FOR SELECT
    USING (public.user_belongs_to_igreja(auth.uid(), igreja_id));

CREATE POLICY "Organizadores can manage eventos"
    ON public.eventos FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.igrejas
            WHERE id = igreja_id AND organizador_id = auth.uid()
        )
    );

-- RLS Policies for equipes
CREATE POLICY "Users can view equipes of their igreja"
    ON public.equipes FOR SELECT
    USING (public.user_belongs_to_igreja(auth.uid(), igreja_id));

CREATE POLICY "Organizadores can manage equipes"
    ON public.equipes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.igrejas
            WHERE id = igreja_id AND organizador_id = auth.uid()
        )
    );

CREATE POLICY "Lideres can update their equipe"
    ON public.equipes FOR UPDATE
    USING (lider_id = auth.uid());

-- RLS Policies for convites
CREATE POLICY "Users can view convites they created"
    ON public.convites FOR SELECT
    USING (convidado_por = auth.uid());

CREATE POLICY "Users can view convites for their email"
    ON public.convites FOR SELECT
    USING (email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Organizadores and Lideres can create convites"
    ON public.convites FOR INSERT
    TO authenticated
    WITH CHECK (convidado_por = auth.uid());

CREATE POLICY "Anyone can view convites by token"
    ON public.convites FOR SELECT
    USING (true);

CREATE POLICY "Anyone can update convite status"
    ON public.convites FOR UPDATE
    USING (true);

-- RLS Policies for ausencias
CREATE POLICY "Users can view their own ausencias"
    ON public.ausencias FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Lideres can view ausencias of their equipe"
    ON public.ausencias FOR SELECT
    USING (public.user_is_lider_of_equipe(auth.uid(), equipe_id));

CREATE POLICY "Users can manage their own ausencias"
    ON public.ausencias FOR ALL
    USING (user_id = auth.uid());

-- RLS Policies for escalas
CREATE POLICY "Users can view escalas of their equipe"
    ON public.escalas FOR SELECT
    USING (public.user_belongs_to_equipe(auth.uid(), equipe_id));

CREATE POLICY "Lideres can manage escalas of their equipe"
    ON public.escalas FOR ALL
    USING (public.user_is_lider_of_equipe(auth.uid(), equipe_id));

-- RLS Policies for escala_membros
CREATE POLICY "Users can view their escala assignments"
    ON public.escala_membros FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view escala_membros of their equipe"
    ON public.escala_membros FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.escalas e
            WHERE e.id = escala_id
            AND public.user_belongs_to_equipe(auth.uid(), e.equipe_id)
        )
    );

CREATE POLICY "Lideres can manage escala_membros"
    ON public.escala_membros FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.escalas e
            WHERE e.id = escala_id
            AND public.user_is_lider_of_equipe(auth.uid(), e.equipe_id)
        )
    );

CREATE POLICY "Members can update their confirmation"
    ON public.escala_membros FOR UPDATE
    USING (user_id = auth.uid());

-- RLS Policies for notificacoes
CREATE POLICY "Users can view their own notificacoes"
    ON public.notificacoes FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can create notificacoes"
    ON public.notificacoes FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_igreja_id ON public.user_roles(igreja_id);
CREATE INDEX idx_eventos_igreja_id ON public.eventos(igreja_id);
CREATE INDEX idx_equipes_igreja_id ON public.equipes(igreja_id);
CREATE INDEX idx_equipes_lider_id ON public.equipes(lider_id);
CREATE INDEX idx_convites_token ON public.convites(token);
CREATE INDEX idx_convites_email ON public.convites(email);
CREATE INDEX idx_ausencias_user_equipe ON public.ausencias(user_id, equipe_id);
CREATE INDEX idx_escalas_equipe_data ON public.escalas(equipe_id, data_escala);
CREATE INDEX idx_escala_membros_escala_id ON public.escala_membros(escala_id);
CREATE INDEX idx_notificacoes_user_id ON public.notificacoes(user_id);
CREATE INDEX idx_notificacoes_agendada ON public.notificacoes(agendada_para) WHERE NOT enviada;