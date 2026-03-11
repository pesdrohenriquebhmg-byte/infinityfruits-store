import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BUCKPAY_API_URL = "https://app.buckpay.com.br";

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
    const { product_id, product_name, amount, total_amount, bumps, buyer } = body;

    if (!product_id || !amount || !buyer?.name || !buyer?.email || !buyer?.phone) {
      return new Response(
        JSON.stringify({ error: "Dados incompletos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const externalId = `order-${crypto.randomUUID()}`;

    // Create order in database
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        external_id: externalId,
        product_id,
        product_name,
        amount,
        total_amount: total_amount || amount,
        buyer_name: buyer.name,
        buyer_email: buyer.email,
        buyer_phone: buyer.phone,
        bumps: bumps || [],
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Erro ao criar pedido no banco");
    }

    // Create payment on Buckpay
    const buckpayPayload = {
      external_id: externalId,
      payment_method: "pix",
      amount: total_amount || amount,
      buyer: {
        name: buyer.name,
        email: buyer.email,
        document: buyer.document || "",
        phone: buyer.phone,
      },
      product: {
        id: product_id,
        name: product_name,
      },
      offer: {
        id: `offer-${product_id}`,
        name: product_name,
        quantity: 1,
      },
      tracking: {
        ref: null,
        src: null,
        sck: null,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_id: null,
        utm_term: null,
        utm_content: null,
      },
    };

    console.log("Sending to Buckpay:", JSON.stringify(buckpayPayload));

    const buckpayResponse = await fetch(`${BUCKPAY_API_URL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BUCKPAY_SECRET}`,
      },
      body: JSON.stringify(buckpayPayload),
    });

    const responseText = await buckpayResponse.text();
    console.log("Buckpay response status:", buckpayResponse.status, "body:", responseText.substring(0, 500));

    let buckpayData;
    try {
      buckpayData = JSON.parse(responseText);
    } catch {
      console.error("Non-JSON response from Buckpay:", responseText.substring(0, 500));
      throw new Error(`Buckpay retornou resposta inválida (status ${buckpayResponse.status}). Verifique a URL da API.`);
    }

    if (!buckpayResponse.ok) {
      console.error("Buckpay error:", buckpayData);
      throw new Error(`Buckpay API error [${buckpayResponse.status}]: ${JSON.stringify(buckpayData)}`);
    }

    // Update order with Buckpay response
    const updateData: Record<string, unknown> = {
      buckpay_id: buckpayData.data?.id || buckpayData.id,
      buckpay_response: buckpayData,
    };

    // Extract PIX code if available
    if (buckpayData.data?.pix_code || buckpayData.pix_code) {
      updateData.pix_code = buckpayData.data?.pix_code || buckpayData.pix_code;
    }
    if (buckpayData.data?.pix_qr_code || buckpayData.pix_qr_code) {
      updateData.pix_qr_code = buckpayData.data?.pix_qr_code || buckpayData.pix_qr_code;
    }

    await supabase
      .from("orders")
      .update(updateData)
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        external_id: externalId,
        pix_code: updateData.pix_code || null,
        pix_qr_code: updateData.pix_qr_code || null,
        buckpay: buckpayData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error creating payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
