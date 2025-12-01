CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ENUMS


CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE', 'OTHER');

CREATE TYPE marital_status_enum AS ENUM (
  'SINGLE',
  'MARRIED',
  'DIVORCED',
  'WIDOWED'
);

CREATE TYPE employee_status_enum AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'ON_HOLD',
  'PROBATION',
  'TERMINATED'
);

CREATE TYPE attendance_status_enum AS ENUM (
  'PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY'
);

CREATE TYPE leave_status_enum AS ENUM (
  'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
);

CREATE TYPE regularization_status_enum AS ENUM (
  'PENDING', 'APPROVED', 'REJECTED'
);

CREATE TYPE subscription_status_enum AS ENUM (
  'ACTIVE', 'EXPIRED', 'TRIAL', 'CANCELLED'
);

CREATE TYPE document_category_enum AS ENUM (
  'OFFER_LETTER',
  'EXPERIENCE_LETTER',
  'ID_PROOF',
  'EDUCATION',
  'PAYSLIP',
  'POLICY',
  'OTHER'
);

-- TENANTS
CREATE TABLE tenants (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name         varchar(150) NOT NULL,
    domain       varchar(150),
    is_active    boolean      NOT NULL DEFAULT true,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- SUBSCRIPTION PLANS
CREATE TABLE subscription_plans (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(100) NOT NULL,
    description          text,
    price_per_month      numeric(10,2) NOT NULL DEFAULT 0,
    price_per_employee   numeric(10,2) NOT NULL DEFAULT 0,
    max_employees        int,
    features             jsonb,
    is_active            boolean NOT NULL DEFAULT true,
    
    -- Trial period support
    is_trial             boolean DEFAULT false,
    trial_duration_days  int DEFAULT 14,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- TENANT SUBSCRIPTION
CREATE TABLE tenant_subscription (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id        uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan_id          uuid NOT NULL REFERENCES subscription_plans(id),

    status           subscription_status_enum NOT NULL DEFAULT 'ACTIVE',
    start_date       date NOT NULL DEFAULT current_date,
    end_date         date,
    trial_end_date   date,
    auto_renew       boolean NOT NULL DEFAULT true,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

CREATE INDEX idx_tenant_subscription_tenant ON tenant_subscription(tenant_id);

-- USERS
CREATE TABLE users (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid REFERENCES tenants(id),
    email        varchar(150) NOT NULL UNIQUE,
    password_hash text NOT NULL,

    role         varchar(30) NOT NULL,  -- SUPER_ADMIN, ADMIN, HR, MANAGER, EMPLOYEE
    is_active    boolean NOT NULL DEFAULT true,

    employee_id  uuid,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_role   ON users(role);

-- ROLES
CREATE TABLE roles (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code        varchar(50) UNIQUE NOT NULL,
    name        varchar(100) NOT NULL,
    description text,

    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    created_by  uuid,
    updated_by  uuid
);

-- PERMISSIONS
CREATE TABLE permissions (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code        varchar(100) UNIQUE NOT NULL,
    description text,

    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    created_by  uuid,
    updated_by  uuid
);

CREATE TABLE role_permissions (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id        uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id  uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,

    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    created_by  uuid,
    updated_by  uuid,

    UNIQUE (role_id, permission_id)
);

-- SESSIONS
CREATE TABLE user_sessions (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid REFERENCES tenants(id),
    user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token text NOT NULL,
    user_agent   text,
    ip_address   varchar(64),

    is_revoked   boolean NOT NULL DEFAULT false,
    expires_at   timestamptz NOT NULL,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- USER TOKENS
CREATE TABLE user_tokens (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid,
    user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token        text NOT NULL,
    type         varchar(30) NOT NULL,
    expires_at   timestamptz NOT NULL,
    used         boolean NOT NULL DEFAULT false,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- PASSWORD RESETS
CREATE TABLE password_resets (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email        varchar(150) NOT NULL,
    token        text NOT NULL UNIQUE,
    expires_at   timestamptz NOT NULL,

    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_email ON password_resets(email);

-- DEPARTMENTS
CREATE TABLE departments (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name         varchar(120) NOT NULL,
    code         varchar(50),

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- DESIGNATIONS
CREATE TABLE designations (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name         varchar(120) NOT NULL,
    level        int,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- EMPLOYEES (UPDATED HERE WITH NEW FIELDS)
CREATE TABLE employees (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id        uuid REFERENCES users(id),

    employee_code  varchar(50) NOT NULL,
    first_name     varchar(120) NOT NULL,
    last_name      varchar(120),
    email          varchar(150) NOT NULL,
    personal_email varchar(150),
    phone          varchar(30),

    gender         gender_enum,
    date_of_birth  date,
    marital_status marital_status_enum,

    status         employee_status_enum NOT NULL DEFAULT 'ACTIVE',

    department_id   uuid REFERENCES departments(id),
    designation_id  uuid REFERENCES designations(id),
    reports_to      uuid,

    date_of_joining date,
    date_of_exit    date,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- SHIFTS
CREATE TABLE shifts (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name         varchar(100) NOT NULL,
    start_time   time NOT NULL,
    end_time     time NOT NULL,
    grace_minutes int DEFAULT 0,
    is_active    boolean NOT NULL DEFAULT true,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- SHIFT ASSIGNMENTS
CREATE TABLE shift_assignments (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id  uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    shift_id     uuid NOT NULL REFERENCES shifts(id),
    starts_from  date NOT NULL,
    ends_on      date,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid,

    UNIQUE (tenant_id, employee_id, shift_id, starts_from)
);

-- ATTENDANCE
CREATE TABLE attendance (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id  uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    date             date NOT NULL,
    check_in_time    time,
    check_out_time   time,
    total_hours      numeric(5,2),
    status           attendance_status_enum NOT NULL DEFAULT 'PRESENT',
    is_late          boolean DEFAULT false,
    late_by_minutes  int,
    shift_id         uuid REFERENCES shifts(id),
    remarks          text,

    approval_status  varchar(20),
    approval_reason  text,
    approved_at      timestamptz,
    rejected_at      timestamptz,

    is_regularized   boolean NOT NULL DEFAULT false,
    regularized_by   uuid,
    regularized_at   timestamptz,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid,

    UNIQUE (tenant_id, employee_id, date)
);

-- ATTENDANCE REGULARIZATION REQUESTS
CREATE TABLE attendance_regularization_requests (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    attendance_id uuid NOT NULL REFERENCES attendance(id) ON DELETE CASCADE,
    employee_id   uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    requested_check_in  time,
    requested_check_out time,
    reason              text NOT NULL,

    status       regularization_status_enum NOT NULL DEFAULT 'PENDING',
    reviewed_by  uuid,
    reviewed_at  timestamptz,
    review_notes text,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- LEAVE MODULE
CREATE TABLE leave_types (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    name         varchar(100) NOT NULL,
    code         varchar(50),
    is_paid      boolean NOT NULL DEFAULT true,
    carried_forward boolean NOT NULL DEFAULT false,
    max_per_year numeric(5,2),

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

CREATE TABLE leave_requests (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    employee_id  uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id uuid NOT NULL REFERENCES leave_types(id),

    start_date   date NOT NULL,
    end_date     date NOT NULL,
    total_days   numeric(5,2) NOT NULL,

    status       leave_status_enum NOT NULL DEFAULT 'PENDING',
    applied_at   timestamptz NOT NULL DEFAULT now(),
    approved_by  uuid,
    approved_at  timestamptz,
    rejection_reason text,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

CREATE TABLE leave_balances (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    employee_id    uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id  uuid NOT NULL REFERENCES leave_types(id),

    balance        numeric(6,2) NOT NULL DEFAULT 0,
    carried_forward numeric(6,2) NOT NULL DEFAULT 0,
    year           int NOT NULL,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid,

    UNIQUE (tenant_id, employee_id, leave_type_id, year)
);

CREATE TABLE leave_holidays (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    date         date NOT NULL,
    name         varchar(150) NOT NULL,
    is_optional  boolean NOT NULL DEFAULT false,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid,

    UNIQUE (tenant_id, date, name)
);

-- DOCUMENTS
CREATE TABLE documents (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    title        varchar(150) NOT NULL,
    type         varchar(30)  NOT NULL,
    file_path    text NOT NULL,
    file_size    bigint,
    mime_type    varchar(100),

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

CREATE TABLE employee_documents (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    employee_id  uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    title        varchar(150) NOT NULL,
    category     document_category_enum,
    file_path    text NOT NULL,
    file_size    bigint,
    mime_type    varchar(100),

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    uuid,

    user_id      uuid,
    module       varchar(100) NOT NULL,
    action       varchar(100) NOT NULL,
    entity       varchar(100),
    entity_id    uuid,

    old_values   jsonb,
    new_values   jsonb,

    ip_address   varchar(64),
    user_agent   text,

    created_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid
);

-- RLS SESSION HELPERS
CREATE OR REPLACE FUNCTION app_tenant_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.tenant_id', true)::uuid;
$$;

CREATE OR REPLACE FUNCTION app_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.user_id', true)::uuid;
$$;

CREATE OR REPLACE FUNCTION app_employee_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.employee_id', true)::uuid;
$$;

CREATE OR REPLACE FUNCTION app_role() RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.role', true);
$$;

CREATE OR REPLACE FUNCTION has_role(role_name text)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT app_role() = role_name;
$$;

CREATE OR REPLACE FUNCTION has_any_role(roles text)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT app_role() = ANY (string_to_array(roles, ','));
$$;


-- 8. ENABLE RLS + POLICIES
-- Tenants / Subscription / Global tables

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;

CREATE POLICY tenants_super_admin_policy
ON tenants
USING (has_role('SUPER_ADMIN'));

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans FORCE ROW LEVEL SECURITY;

CREATE POLICY subscription_plans_super_admin_policy
ON subscription_plans
USING (has_role('SUPER_ADMIN'));

ALTER TABLE tenant_subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscription FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_subscription_super_admin_policy
ON tenant_subscription
USING (has_role('SUPER_ADMIN'));

CREATE POLICY tenant_subscription_tenant_policy
ON tenant_subscription
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

-- Users

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY users_super_admin_policy
ON users
USING (has_role('SUPER_ADMIN'));

CREATE POLICY users_admin_hr_policy
ON users
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

CREATE POLICY users_manager_policy
ON users
USING (
  tenant_id = app_tenant_id()
  AND has_role('MANAGER')
  AND (
    id = app_user_id()
    OR id IN (
      SELECT e.user_id
      FROM employees e
      WHERE e.tenant_id = app_tenant_id()
        AND e.reports_to = app_employee_id()
    )
  )
);

CREATE POLICY users_employee_policy
ON users
USING (
  tenant_id = app_tenant_id()
  AND id = app_user_id()
);

-- Password reset policy - allows updating password_hash when there's a valid reset token
CREATE POLICY users_password_reset_policy
ON users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM password_resets
    WHERE password_resets.email = users.email
    AND password_resets.expires_at > now()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM password_resets
    WHERE password_resets.email = users.email
    AND password_resets.expires_at > now()
  )
);

-- Employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees FORCE ROW LEVEL SECURITY;

CREATE POLICY employees_super_admin_policy
ON employees
USING (has_role('SUPER_ADMIN'));

CREATE POLICY employees_admin_hr_policy
ON employees
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

CREATE POLICY employees_manager_policy
ON employees
USING (
  tenant_id = app_tenant_id()
  AND has_role('MANAGER')
  AND (
    id = app_employee_id()
    OR reports_to = app_employee_id()
  )
);

CREATE POLICY employees_employee_policy
ON employees
USING (
  tenant_id = app_tenant_id()
  AND id = app_employee_id()
);

-- Departments / Designations
-- (Tenant-wide, readable by all tenant users)

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments FORCE ROW LEVEL SECURITY;

CREATE POLICY departments_super_admin_policy
ON departments
USING (has_role('SUPER_ADMIN'));

CREATE POLICY departments_tenant_policy
ON departments
USING (tenant_id = app_tenant_id());

ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations FORCE ROW LEVEL SECURITY;

CREATE POLICY designations_super_admin_policy
ON designations
USING (has_role('SUPER_ADMIN'));

CREATE POLICY designations_tenant_policy
ON designations
USING (tenant_id = app_tenant_id());

-- Shifts / Shift assignments
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts FORCE ROW LEVEL SECURITY;

CREATE POLICY shifts_super_admin_policy
ON shifts
USING (has_role('SUPER_ADMIN'));

CREATE POLICY shifts_tenant_policy
ON shifts
USING (tenant_id = app_tenant_id());

ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments FORCE ROW LEVEL SECURITY;

CREATE POLICY shift_assignments_super_admin_policy
ON shift_assignments
USING (has_role('SUPER_ADMIN'));

CREATE POLICY shift_assignments_tenant_policy
ON shift_assignments
USING (tenant_id = app_tenant_id());

-- Attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance FORCE ROW LEVEL SECURITY;

CREATE POLICY attendance_super_admin_policy
ON attendance
USING (has_role('SUPER_ADMIN'));

CREATE POLICY attendance_admin_hr_policy
ON attendance
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

CREATE POLICY attendance_manager_policy
ON attendance
USING (
  tenant_id = app_tenant_id()
  AND has_role('MANAGER')
  AND (
    employee_id = app_employee_id()
    OR employee_id IN (
      SELECT e.id
      FROM employees e
      WHERE e.tenant_id = app_tenant_id()
        AND e.reports_to = app_employee_id()
    )
  )
);

CREATE POLICY attendance_employee_policy
ON attendance
USING (
  tenant_id = app_tenant_id()
  AND employee_id = app_employee_id()
);

-- Attendance regularization (same scope as attendance)
ALTER TABLE attendance_regularization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_regularization_requests FORCE ROW LEVEL SECURITY;

CREATE POLICY att_reg_super_admin_policy
ON attendance_regularization_requests
USING (has_role('SUPER_ADMIN'));

CREATE POLICY att_reg_admin_hr_policy
ON attendance_regularization_requests
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

CREATE POLICY att_reg_manager_policy
ON attendance_regularization_requests
USING (
  tenant_id = app_tenant_id()
  AND has_role('MANAGER')
  AND (
    employee_id = app_employee_id()
    OR employee_id IN (
      SELECT e.id
      FROM employees e
      WHERE e.tenant_id = app_tenant_id()
        AND e.reports_to = app_employee_id()
    )
  )
);

CREATE POLICY att_reg_employee_policy
ON attendance_regularization_requests
USING (
  tenant_id = app_tenant_id()
  AND employee_id = app_employee_id()
);

-- Leave tables
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types FORCE ROW LEVEL SECURITY;

CREATE POLICY leave_types_tenant_policy
ON leave_types
USING (tenant_id = app_tenant_id());

ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests FORCE ROW LEVEL SECURITY;

CREATE POLICY leave_requests_super_admin_policy
ON leave_requests
USING (has_role('SUPER_ADMIN'));

CREATE POLICY leave_requests_admin_hr_policy
ON leave_requests
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

CREATE POLICY leave_requests_manager_policy
ON leave_requests
USING (
  tenant_id = app_tenant_id()
  AND has_role('MANAGER')
  AND (
    employee_id = app_employee_id()
    OR employee_id IN (
      SELECT e.id
      FROM employees e
      WHERE e.tenant_id = app_tenant_id()
        AND e.reports_to = app_employee_id()
    )
  )
);

CREATE POLICY leave_requests_employee_policy
ON leave_requests
USING (
  tenant_id = app_tenant_id()
  AND employee_id = app_employee_id()
);

ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances FORCE ROW LEVEL SECURITY;

CREATE POLICY leave_balances_super_admin_policy
ON leave_balances
USING (has_role('SUPER_ADMIN'));

CREATE POLICY leave_balances_admin_hr_policy
ON leave_balances
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

CREATE POLICY leave_balances_manager_policy
ON leave_balances
USING (
  tenant_id = app_tenant_id()
  AND has_role('MANAGER')
  AND (
    employee_id = app_employee_id()
    OR employee_id IN (
      SELECT e.id
      FROM employees e
      WHERE e.tenant_id = app_tenant_id()
        AND e.reports_to = app_employee_id()
    )
  )
);

CREATE POLICY leave_balances_employee_policy
ON leave_balances
USING (
  tenant_id = app_tenant_id()
  AND employee_id = app_employee_id()
);

ALTER TABLE leave_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_holidays FORCE ROW LEVEL SECURITY;

CREATE POLICY leave_holidays_tenant_policy
ON leave_holidays
USING (tenant_id = app_tenant_id());
-- Documents

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

CREATE POLICY documents_read_policy
ON documents
FOR SELECT
USING (tenant_id = app_tenant_id());

CREATE POLICY documents_write_policy
ON documents
FOR ALL
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR,SUPER_ADMIN')
)
WITH CHECK (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR,SUPER_ADMIN')
);

ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents FORCE ROW LEVEL SECURITY;

CREATE POLICY emp_docs_super_admin_policy
ON employee_documents
USING (has_role('SUPER_ADMIN'));

CREATE POLICY emp_docs_admin_hr_policy
ON employee_documents
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

CREATE POLICY emp_docs_manager_policy
ON employee_documents
USING (
  tenant_id = app_tenant_id()
  AND has_role('MANAGER')
  AND (
    employee_id = app_employee_id()
    OR employee_id IN (
      SELECT e.id
      FROM employees e
      WHERE e.tenant_id = app_tenant_id()
        AND e.reports_to = app_employee_id()
    )
  )
);

CREATE POLICY emp_docs_employee_policy
ON employee_documents
USING (
  tenant_id = app_tenant_id()
  AND employee_id = app_employee_id()
);
-- User sessions & tokens

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions FORCE ROW LEVEL SECURITY;

CREATE POLICY sessions_super_admin_policy
ON user_sessions
USING (has_role('SUPER_ADMIN'));

CREATE POLICY sessions_tenant_policy
ON user_sessions
USING (
  tenant_id = app_tenant_id()
  AND user_id = app_user_id()
);

ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens FORCE ROW LEVEL SECURITY;

CREATE POLICY user_tokens_super_admin_policy
ON user_tokens
USING (has_role('SUPER_ADMIN'));

CREATE POLICY user_tokens_tenant_policy
ON user_tokens
USING (
  tenant_id = app_tenant_id()
  AND user_id = app_user_id()
);
-- Audit logs

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_super_admin_policy
ON audit_logs
USING (has_role('SUPER_ADMIN'));

CREATE POLICY audit_logs_admin_hr_policy
ON audit_logs
USING (
  tenant_id = app_tenant_id()
  AND has_any_role('ADMIN,HR')
);

-- Column documentation
COMMENT ON COLUMN tenant_subscription.status IS 'Subscription status: ACTIVE, TRIAL, EXPIRED, CANCELLED';

-- IMPORTANT: In your Node.js backend, for every request, set:
--   SET app.tenant_id   = '<tenant-uuid>';
--   SET app.user_id     = '<user-uuid>';
--   SET app.employee_id = '<employee-uuid>';
--   SET app.role        = '<SUPER_ADMINADMINHRMANAGEREMPLOYEE>';
-- before running business queries.

