import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BUCKPAY_API_URL = "https://api.realtechdev.com.br";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BUCKPAY_SECRET = Deno.env.get("BUCKPAY_SECRET_TOKEN");
    if (!BUCKPAY_SECRET) {
      throw new Error("BUCKPAY_SECRET_TOKEN is not configured");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { original_order_id, buyer_name, buyer_email, buyer_phone } = body;

    if (!original_order_id || !buyer_name || !buyer_email || !buyer_phone) {
      return new Response(
        JSON.stringify({ error: "Dados incompletos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const externalId = `priority-${crypto.randomUUID()}`;
    const amountCents = 999; // R$9,99

    // Create priority order in database
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        external_id: externalId,
        product_id: `priority-${original_order_id}`,
        product_name: "Entrega Automática Imediata",
        amount: amountCents,
        total_amount: amountCents,
        buyer_name,
        buyer_email,
        buyer_phone,
        bumps: [],
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Erro ao criar pedido de prioridade no banco");
    }

    const phone = buyer_phone.startsWith("55") ? buyer_phone : `55${buyer_phone}`;

    const sanitizeName = (raw: string): string => {
      const cleaned = (raw || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-ZÀ-ÿ\s\-']/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned.length < 2) return "Cliente Infinity";
      return cleaned.includes(" ") ? cleaned : `${cleaned} Silva`;
    };
    const safeName = sanitizeName(buyer_name);

    const buckpayPayload = {
      external_id: externalId,
      payment_method: "pix",
      amount: amountCents,
      buyer: {
        name: safeName,
        email: buyer_email,
        phone,
      },
      product: {
        id: `priority-${original_order_id}`,
        name: "Entrega Automática Imediata",
      },
      offer: {
        id: `offer-priority-${original_order_id}`,
        name: "Entrega Automática Imediata",
        quantity: 1,
      },
      postbackUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/buckpay-webhook?token=${BUCKPAY_SECRET}`,
    };

    console.log("Calling Buckpay for priority:", JSON.stringify(buckpayPayload));

    const buckpayResponse = await fetch(`${BUCKPAY_API_URL}/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BUCKPAY_SECRET}`,
        "User-Agent": "Buckpay API",
      },
      body: JSON.stringify(buckpayPayload),
    });

    const responseText = await buckpayResponse.text();
    console.log("Buckpay response:", buckpayResponse.status, responseText.substring(0, 500));

    let buckpayData;
    try {
      buckpayData = JSON.parse(responseText);
    } catch {
      console.error("Non-JSON response:", responseText.substring(0, 500));
      throw new Error(`Buckpay retornou resposta inválida (status ${buckpayResponse.status})`);
    }

    if (!buckpayResponse.ok) {
      console.error("Buckpay error:", buckpayData);
      throw new Error(`Buckpay API error [${buckpayResponse.status}]: ${JSON.stringify(buckpayData)}`);
    }

    const pixCode = buckpayData.data?.pix?.code || "";
    const pixQrBase64 = buckpayData.data?.pix?.qrcode_base64 || "";
    const pixQrCode = pixQrBase64 ? `data:image/png;base64,${pixQrBase64}` : "";

    await supabase
      .from("orders")
      .update({
        buckpay_id: buckpayData.data?.id || null,
        buckpay_response: buckpayData,
        pix_code: pixCode || null,
        pix_qr_code: pixQrCode || null,
      })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        external_id: externalId,
        pix_code: pixCode,
        pix_qr_code: pixQrCode,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error creating priority payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
