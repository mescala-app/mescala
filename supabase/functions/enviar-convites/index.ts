import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConviteRequest {
  igreja_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { igreja_id }: ConviteRequest = await req.json();

    if (!igreja_id) {
      return new Response(
        JSON.stringify({ error: "igreja_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch pending invites for this igreja
    const { data: convites, error: convitesError } = await supabase
      .from("convites")
      .select(`
        id,
        token,
        email,
        tipo,
        equipe_id,
        equipes (nome),
        igrejas (nome)
      `)
      .eq("igreja_id", igreja_id)
      .eq("status", "pending");

    if (convitesError) {
      console.error("Error fetching convites:", convitesError);
      throw new Error("Failed to fetch invites");
    }

    if (!convites || convites.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending invites found", sent: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const baseUrl = req.headers.get("origin") || "https://escaleluia.lovable.app";
    const results = [];

    for (const convite of convites) {
      const inviteUrl = `${baseUrl}/aceitar-convite?token=${convite.token}`;
      const igrejaName = (convite.igrejas as any)?.nome || "Igreja";
      const equipeName = (convite.equipes as any)?.nome || "";
      const tipoLabel = convite.tipo === "lider" ? "Líder de Equipe" : "Membro";

      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Escaleluia <onboarding@resend.dev>",
            to: [convite.email],
            subject: `Você foi convidado para a ${igrejaName}!`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">📅 Escaleluia</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Gestão de Escalas para Igrejas</p>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="color: #1e3a5f; margin-top: 0;">Você foi convidado! 🎉</h2>
                
                <p>Olá!</p>
                
                <p>Você foi convidado para fazer parte da equipe de <strong>${igrejaName}</strong> como <strong>${tipoLabel}</strong>${equipeName ? ` na equipe <strong>${equipeName}</strong>` : ""}.</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                  <p style="margin: 0;"><strong>Igreja:</strong> ${igrejaName}</p>
                  ${equipeName ? `<p style="margin: 8px 0 0;"><strong>Equipe:</strong> ${equipeName}</p>` : ""}
                  <p style="margin: 8px 0 0;"><strong>Função:</strong> ${tipoLabel}</p>
                </div>
                
                <p>Clique no botão abaixo para aceitar o convite e criar sua conta:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${inviteUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Aceitar Convite
                  </a>
                </div>
                
                <p style="color: #64748b; font-size: 14px;">
                  Este convite expira em 7 dias. Se você não solicitou este convite, pode ignorar este email.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                  © ${new Date().getFullYear()} Escaleluia. Todos os direitos reservados.
                </p>
              </div>
            </body>
            </html>
          `,
          }),
        });

        const emailData = await emailResponse.json();
        
        if (!emailResponse.ok) {
          throw new Error(emailData.message || "Failed to send email");
        }

        console.log(`Email sent to ${convite.email}:`, emailData);
        results.push({ email: convite.email, success: true, id: emailData.id });
      } catch (emailError: any) {
        console.error(`Failed to send email to ${convite.email}:`, emailError);
        results.push({ email: convite.email, success: false, error: emailError.message });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return new Response(
      JSON.stringify({ 
        message: `Sent ${successCount} of ${convites.length} invites`,
        sent: successCount,
        results 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in enviar-convites function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
