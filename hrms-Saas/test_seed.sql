-- Test seed function
CREATE TEMPORARY FUNCTION seed_as_super_admin() RETURNS void AS $$
BEGIN
  PERFORM set_config('app.role', 'SUPER_ADMIN', false);
  PERFORM set_config('app.tenant_id', '', false);
  PERFORM set_config('app.user_id', '', false);
  PERFORM set_config('app.employee_id', '', false);
END;
$$ LANGUAGE plpgsql;

SELECT seed_as_super_admin();

-- Check if role is set
SELECT current_setting('app.role');

-- Try inserting
INSERT INTO tenants (id, name, domain, is_active) VALUES 
('00000001-0000-0000-0000-000000000000', 'Demo Company', 'demo.example.com', true);

SELECT COUNT(*) FROM tenants;
