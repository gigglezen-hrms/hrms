
BEGIN;

-- Temporarily disable RLS for seeding
ALTER TABLE subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscription DISABLE ROW LEVEL SECURITY;

-- Insert subscription plans
INSERT INTO subscription_plans (
    name, 
    description, 
    price_per_month, 
    price_per_employee, 
    max_employees, 
    features, 
    plan_type, 
    billing_cycle_months, 
    currency, 
    trial_duration_days
) VALUES
-- Trial Plan
(
    'Trial Plan',
    'Free trial plan with basic features for 14 days',
    0,
    0,
    50,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'shift_management', false,
        'payroll', false,
        'advanced_reporting', false,
        'api_access', false,
        'max_users', 5
    ),
    'MONTHLY',
    1,
    'INR',
    14
),

-- Starter Plan (Monthly)
(
    'Starter Plan',
    'Perfect for small businesses getting started with HR management',
    4999,
    500,
    50,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'shift_management', true,
        'payroll', false,
        'advanced_reporting', false,
        'api_access', false,
        'max_users', 10,
        'support', 'email'
    ),
    'MONTHLY',
    1,
    'INR',
    null
),

-- Starter Plan (Quarterly)
(
    'Starter Plan - Quarterly',
    'Starter plan billed quarterly (save 5%)',
    14249,
    500,
    50,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'shift_management', true,
        'payroll', false,
        'advanced_reporting', false,
        'api_access', false,
        'max_users', 10,
        'support', 'email'
    ),
    'QUARTERLY',
    3,
    'INR',
    null
),

-- Professional Plan (Monthly)
(
    'Professional Plan',
    'Comprehensive HR management for growing companies',
    9999,
    800,
    200,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'advanced_reporting', true,
        'shift_management', true,
        'payroll', true,
        'api_access', false,
        'max_users', 25,
        'support', 'email_and_phone',
        'custom_workflows', true,
        'multi_location', true
    ),
    'MONTHLY',
    1,
    'INR',
    null
),

-- Professional Plan (Half-Yearly)
(
    'Professional Plan - Half-Yearly',
    'Professional plan billed half-yearly (save 10%)',
    53946,
    800,
    200,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'advanced_reporting', true,
        'shift_management', true,
        'payroll', true,
        'api_access', false,
        'max_users', 25,
        'support', 'email_and_phone',
        'custom_workflows', true,
        'multi_location', true
    ),
    'HALF_YEARLY',
    6,
    'INR',
    null
),

-- Enterprise Plan (Monthly)
(
    'Enterprise Plan',
    'Full-featured HR suite with priority support and advanced integrations',
    19999,
    1000,
    1000,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'advanced_reporting', true,
        'shift_management', true,
        'payroll', true,
        'api_access', true,
        'max_users', 100,
        'support', 'dedicated_support',
        'custom_workflows', true,
        'multi_location', true,
        'sso', true,
        'compliance_reports', true,
        'custom_branding', true,
        'white_label', false
    ),
    'MONTHLY',
    1,
    'INR',
    null
),

-- Enterprise Plan (Yearly)
(
    'Enterprise Plan - Yearly',
    'Enterprise plan billed yearly (save 15%)',
    204485,
    1000,
    1000,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'advanced_reporting', true,
        'shift_management', true,
        'payroll', true,
        'api_access', true,
        'max_users', 100,
        'support', 'dedicated_support',
        'custom_workflows', true,
        'multi_location', true,
        'sso', true,
        'compliance_reports', true,
        'custom_branding', true,
        'white_label', false
    ),
    'YEARLY',
    12,
    'INR',
    null
),

-- Premium Plan - Per Employee (For large orgs)
(
    'Premium Plan - Per Employee',
    'Premium plan with per-employee pricing for large organizations',
    5000,
    1500,
    5000,
    jsonb_build_object(
        'attendance', true,
        'leave_management', true,
        'employee_management', true,
        'basic_reporting', true,
        'advanced_reporting', true,
        'shift_management', true,
        'payroll', true,
        'api_access', true,
        'max_users', 200,
        'support', 'dedicated_support',
        'custom_workflows', true,
        'multi_location', true,
        'sso', true,
        'compliance_reports', true,
        'custom_branding', true,
        'white_label', true,
        'analytics_dashboard', true
    ),
    'PER_EMPLOYEE',
    1,
    'INR',
    null
);



-- Re-enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscription ENABLE ROW LEVEL SECURITY;

COMMIT;
