import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CadastroRequest {
  token: string;
  email: string;
  password: string;
  nome: string;
  apelido?: string;
  whatsapp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { token, email, password, nome, apelido, whatsapp }: CadastroRequest = await req.json();

    if (!token || !email || !password || !nome) {
      return new Response(
        JSON.stringify({ error: "token, email, password e nome são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Re-validate the invite server-side: it's the identity proof that lets
    // this account skip Supabase's own email confirmation step.
    const { data: convite, error: conviteError } = await supabase
      .from("convites")
      .select("id, email, status, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (conviteError || !convite) {
      return new Response(
        JSON.stringify({ error: "Convite inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (convite.status !== "pending") {
      return new Response(
        JSON.stringify({ error: "Este convite já foi utilizado" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(convite.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Este convite expirou" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (convite.email.toLowerCase() !== email.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Email não corresponde ao convite" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Account is created already confirmed - the invite token is the proof
    // of identity, so Supabase's own "confirm your email" step is skipped.
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nome_completo: nome,
        whatsapp: whatsapp || null,
        apelido: apelido || null,
      },
    });

    if (createError || !created.user) {
      console.error("Error creating user:", createError);
      return new Response(
        JSON.stringify({ error: createError?.message || "Erro ao criar usuário" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: created.user.id,
        nome_completo: nome,
        apelido: apelido || null,
        email,
        whatsapp: whatsapp || null,
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }

    return new Response(
      JSON.stringify({ user_id: created.user.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in aceitar-convite-cadastro function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
