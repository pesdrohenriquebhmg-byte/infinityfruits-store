import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, user-agent, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    // Verify the request comes from Buckpay (check authorization header)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${BUCKPAY_SECRET}` && authHeader !== BUCKPAY_SECRET) {
      // Also check for token in query params or custom header
      const url = new URL(req.url);
      const tokenParam = url.searchParams.get("token");
      if (tokenParam !== BUCKPAY_SECRET) {
        console.error("Unauthorized webhook attempt");
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    console.log("Webhook received:", JSON.stringify(body));

    const data = body.data || body;
    const buckpayId = data.id;
    const status = data.status;
    const netAmount = data.net_amount;
    const pixCode = data.pix_code;

    if (!buckpayId || !status) {
      return new Response(
        JSON.stringify({ error: "Missing id or status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map Buckpay status to our status
    let orderStatus = "pending";
    if (status === "paid" || status === "approved") {
      orderStatus = "paid";
    } else if (status === "expired" || status === "cancelled" || status === "refunded") {
      orderStatus = status;
    } else if (status === "waiting_payment") {
      orderStatus = "pending";
    }

    // Update order by buckpay_id
    const updateData: Record<string, unknown> = {
      status: orderStatus,
      buckpay_response: body,
    };

    if (orderStatus === "paid") {
      updateData.paid_at = new Date().toISOString();
    }

    // Try update by buckpay_id first
    let updated = false;
    
    const { data: updatedOrder, error: dbError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("buckpay_id", buckpayId)
      .select()
      .single();

    if (!dbError && updatedOrder) {
      updated = true;
    }

    // Fallback: try by external_id
    if (!updated && data.external_id) {
      const { data: order2, error: err2 } = await supabase
        .from("orders")
        .update(updateData)
        .eq("external_id", data.external_id)
        .select()
        .single();
      if (!err2 && order2) updated = true;
    }

    // Fallback: try by pix_code (handles race condition where buckpay_id wasn't saved yet)
    if (!updated && pixCode) {
      const { data: order3, error: err3 } = await supabase
        .from("orders")
        .update(updateData)
        .eq("pix_code", pixCode)
        .select()
        .single();
      if (!err3 && order3) updated = true;
    }

    if (!updated) {
      console.error("Order not found for buckpay_id:", buckpayId, "external_id:", data.external_id, "pix_code:", pixCode);
      throw new Error("Order not found");
    }

    console.log(`Order updated: buckpay_id=${buckpayId}, status=${orderStatus}`);

    return new Response(
      JSON.stringify({ success: true, status: orderStatus }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
