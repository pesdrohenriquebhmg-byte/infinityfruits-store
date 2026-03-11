CREATE OR REPLACE FUNCTION public.get_order_status(order_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status FROM public.orders WHERE id = order_id;
$$;