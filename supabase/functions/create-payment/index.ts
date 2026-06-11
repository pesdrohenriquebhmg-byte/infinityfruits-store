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
    const { product_id, product_name, amount, total_amount, bumps, buyer } = body;
    const chargeAmount = Number(total_amount || amount);

    if (!product_id || !amount || !buyer?.name || !buyer?.email || !buyer?.phone) {
      return new Response(
        JSON.stringify({ error: "Dados incompletos (nome, e-mail e WhatsApp são obrigatórios)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!Number.isFinite(chargeAmount) || chargeAmount < 600) {
      return new Response(
        JSON.stringify({ error: "O valor mínimo para gerar PIX é R$ 6,00. Adicione outro produto ao pedido e tente novamente." }),
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

    // Phone needs country code for Buckpay (55 + number)
    const phone = buyer.phone.startsWith("55") ? buyer.phone : `55${buyer.phone}`;

    // Buckpay only accepts letters, spaces, hyphens and apostrophes in name.
    // Many users put their Roblox username (with numbers) here, which gets rejected.
    const sanitizeName = (raw: string): string => {
      const cleaned = (raw || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // strip diacritics
        .replace(/[^a-zA-ZÀ-ÿ\s\-']/g, " ") // keep only letters, spaces, hyphens, apostrophes
        .replace(/\s+/g, " ")
        .trim();
      if (cleaned.length < 2) return "Cliente Infinity";
      // Buckpay also requires at least two name parts in some cases
      return cleaned.includes(" ") ? cleaned : `${cleaned} Silva`;
    };
    const safeName = sanitizeName(buyer.name);

    // Generate a valid random CPF when not provided (Buckpay requires it)
    const generateValidCPF = (): string => {
      const n: number[] = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
      const calc = (arr: number[], start: number) => {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) sum += arr[i] * (start - i);
        const d = (sum * 10) % 11;
        return d === 10 ? 0 : d;
      };
      const d1 = calc(n, 10);
      const d2 = calc([...n, d1], 11);
      return [...n, d1, d2].join("");
    };
    const rawDoc = String(buyer.document || "").replace(/\D/g, "");
    const document = rawDoc.length === 11 ? rawDoc : generateValidCPF();

    const buckpayPayload = {
      external_id: externalId,
      payment_method: "pix",
      amount: chargeAmount,
      buyer: {
        name: safeName,
        email: buyer.email,
        phone,
        document,
        document_type: "cpf",
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
      postbackUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/buckpay-webhook?token=${BUCKPAY_SECRET}`,
    };

    console.log("Calling Buckpay:", JSON.stringify(buckpayPayload));

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

    // Extract PIX data from documented response: data.pix.code / data.pix.qrcode_base64
    const pixCode = buckpayData.data?.pix?.code || "";
    const pixQrBase64 = buckpayData.data?.pix?.qrcode_base64 || "";
    const pixQrCode = pixQrBase64 ? `data:image/png;base64,${pixQrBase64}` : "";

    // Update order with Buckpay response
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
    console.error("Error creating payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
