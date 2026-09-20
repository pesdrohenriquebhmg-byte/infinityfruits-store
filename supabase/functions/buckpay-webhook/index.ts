import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, user-agent, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type OrderRow = {
  id: string;
  status: string;
  external_id: string | null;
  buckpay_id: string | null;
  pix_code: string | null;
  total_amount: number | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BUCKPAY_SECRET = Deno.env.get("BUCKPAY_SECRET_TOKEN");
    if (!BUCKPAY_SECRET) {
      throw new Error("BUCKPAY_SECRET_TOKEN is not configured");
    }

    // --- Collect every place Buckpay (or our own postbackUrl) may carry the token ---
    const url = new URL(req.url);
    const authHeader = req.headers.get("authorization") ?? "";
    const presentedTokens = [
      authHeader.replace(/^Bearer\s+/i, "").trim(),
      authHeader.trim(),
      req.headers.get("x-webhook-token")?.trim() ?? "",
      req.headers.get("x-buckpay-token")?.trim() ?? "",
      req.headers.get("apikey")?.trim() ?? "",
      url.searchParams.get("token")?.trim() ?? "",
      url.searchParams.get("secret")?.trim() ?? "",
    ].filter(Boolean);

    const tokenOk = presentedTokens.some((t) => t === BUCKPAY_SECRET);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const event: string = body?.event ?? "unknown";
    // Buckpay nests everything under `data`; some payloads come flat.
    const data = body?.data ?? body ?? {};

    const buckpayId: string | undefined = data.id ?? undefined;
    const status: string | undefined = data.status ?? undefined;
    // external_id / pix code can appear at different levels depending on the event
    const externalId: string | undefined =
      data.external_id ?? data.externalId ?? data.offer?.external_id ?? body?.external_id ?? undefined;
    const pixCode: string | undefined =
      data.pix_code ?? data.pix?.code ?? body?.pix_code ?? undefined;
    const totalAmount: number | undefined =
      typeof data.total_amount === "number" ? data.total_amount : undefined;

    console.log(`Webhook ${event}: id=${buckpayId} status=${status} external_id=${externalId ?? "-"} amount=${totalAmount ?? "-"}`);

    if (!buckpayId || !status) {
      return json({ error: "Missing id or status" }, 400);
    }

    // --- Locate the order. Several strategies, because Buckpay does not always
    // echo external_id, and transaction.created can race create-payment's update. ---
    const findOrder = async (): Promise<OrderRow | null> => {
      const select = "id,status,external_id,buckpay_id,pix_code,total_amount";

      const byBuckpay = await supabase
        .from("orders").select(select).eq("buckpay_id", buckpayId).maybeSingle();
      if (byBuckpay.data) return byBuckpay.data as OrderRow;

      if (externalId) {
        const byExternal = await supabase
          .from("orders").select(select).eq("external_id", externalId).maybeSingle();
        if (byExternal.data) return byExternal.data as OrderRow;
      }

      if (pixCode) {
        const byPix = await supabase
          .from("orders").select(select).eq("pix_code", pixCode)
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (byPix.data) return byPix.data as OrderRow;
      }

      return null;
    };

    // Retry briefly: create-payment may still be writing buckpay_id/pix_code.
    let order = await findOrder();
    for (let attempt = 0; !order && attempt < 4; attempt++) {
      await sleep(600);
      order = await findOrder();
    }

    if (!order) {
      // Unknown transaction (gateway test event, or a charge created outside this
      // store). Acknowledge with 200 so Buckpay stops retrying forever.
      console.warn(
        `Ignoring webhook for unknown transaction: event=${event} buckpay_id=${buckpayId} external_id=${externalId ?? "-"}`
      );
      return json({ success: true, ignored: true, reason: "order_not_found", buckpay_id: buckpayId });
    }

    // --- Map Buckpay status to our status ---
    let orderStatus = "pending";
    if (status === "paid" || status === "approved") orderStatus = "paid";
    else if (status === "expired" || status === "cancelled" || status === "refunded") orderStatus = status;

    // --- Idempotency: never downgrade or re-process a settled order ---
    if (order.status === "paid" && orderStatus !== "paid") {
      console.log(`Order ${order.id} already paid; ignoring ${status}`);
      return json({ success: true, status: order.status, idempotent: true });
    }
    if (order.status === orderStatus && orderStatus === "paid") {
      console.log(`Order ${order.id} already paid; duplicate webhook ignored`);
      return json({ success: true, status: "paid", idempotent: true });
    }

    const updateData: Record<string, unknown> = {
      status: orderStatus,
      buckpay_response: body,
    };
    // Backfill the link so later events resolve on the first lookup.
    if (!order.buckpay_id) updateData.buckpay_id = buckpayId;
    if (!order.pix_code && pixCode) updateData.pix_code = pixCode;
    if (orderStatus === "paid") updateData.paid_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return json({ error: "Failed to update order" }, 500);
    }

    console.log(`Order ${order.id} updated: event=${event} status=${orderStatus}`);
    return json({ success: true, order_id: order.id, status: orderStatus });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return json({ error: errorMessage }, 500);
  }
});
