
-- Drop the overly permissive policy and replace with service-role-only access
DROP POLICY "Service role full access" ON public.orders;

-- Create a policy that denies all access to anon/authenticated users
-- Service role bypasses RLS automatically
CREATE POLICY "Deny public access" ON public.orders
  FOR ALL USING (false);
