-- ===================================================================
-- HRMS SAAS - MASTER SCHEMA (FINAL WORKING VERSION)
-- ===================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- ===================================================================
-- ENUM TYPES
CREATE TYPE subscription_status_enum AS ENUM (
  'ACTIVE', 'EXPIRED', 'TRIAL', 'CANCELLED','INACTIVE'
);

CREATE TYPE plan_type_enum AS ENUM (
  'MONTHLY','YEARLY', 'HALF_YEARLY','QUARTERLY','PER_EMPLOYEE','TRAIL'
);
-- ===================================================================
-- 1. TENANTS
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    zip_code VARCHAR(20),
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX tenants_domain_key ON tenants(domain);
CREATE UNIQUE INDEX tenants_email_key ON tenants(email);

-- ===================================================================
-- 2. ROLES
-- ===================================================================
CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP DEFAULT now()
);

-- ===================================================================
-- 3. USERS
-- ===================================================================
CREATE TABLE users (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id            UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email                VARCHAR(150) NOT NULL,
    password_hash        TEXT NOT NULL,
    role                 VARCHAR(30) NOT NULL,

    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    must_change_password BOOLEAN NOT NULL DEFAULT TRUE,

    last_login_at        TIMESTAMP,
    last_password_change TIMESTAMP,

    created_at           TIMESTAMP DEFAULT now(),
    updated_at           TIMESTAMP DEFAULT now(),
    created_by           UUID,
    updated_by           UUID
);

-- superadmin must not collide with any tenant
CREATE UNIQUE INDEX users_unique_global_superadmin ON users(email)
    WHERE tenant_id IS NULL;

-- per-tenant user email uniqueness
CREATE UNIQUE INDEX users_email_per_tenant ON users(tenant_id, email);

-- ===================================================================
-- 4. EMPLOYEES (one-to-one with users)
-- ===================================================================
CREATE TABLE employees (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(20),
    department_id   UUID,
    designation_id  UUID,
    reports_to      UUID,

    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

-- ===================================================================
-- 5. DEPARTMENTS
-- ===================================================================
CREATE TABLE departments (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,
    description  TEXT,
    is_active    BOOLEAN DEFAULT TRUE,

    created_at   TIMESTAMP DEFAULT now(),
    updated_at   TIMESTAMP DEFAULT now(),
    created_by   UUID,
    updated_by   UUID
);

CREATE UNIQUE INDEX dept_unique_name_per_tenant ON departments(tenant_id, name);

-- ===================================================================
-- 6. DESIGNATIONS
-- ===================================================================
CREATE TABLE designations (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,
    description  TEXT,
    is_active    BOOLEAN DEFAULT TRUE,

    created_at   TIMESTAMP DEFAULT now(),
    updated_at   TIMESTAMP DEFAULT now(),
    created_by   UUID,
    updated_by   UUID
);

CREATE UNIQUE INDEX designation_unique_name_per_tenant ON designations(tenant_id, name);

-- ===================================================================
-- 7. USER SESSIONS (Refresh Token)
-- ===================================================================
CREATE TABLE user_sessions (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id      UUID,
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    refresh_token  TEXT NOT NULL,
    ip_address     TEXT,
    user_agent     TEXT,
    is_revoked     BOOLEAN DEFAULT FALSE,

    expires_at     TIMESTAMP NOT NULL,
    created_at     TIMESTAMP DEFAULT now(),
    updated_at     TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_sessions_refresh ON user_sessions(refresh_token);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);

-- ===================================================================
-- 8. PASSWORD RESET TOKENS
-- ===================================================================
CREATE TABLE password_resets (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email        TEXT NOT NULL,
    token        TEXT NOT NULL,
    expires_at   TIMESTAMP NOT NULL,
    created_at   TIMESTAMP DEFAULT now()
);

CREATE INDEX password_reset_email_idx ON password_resets(email);

-- ===================================================================
-- 9. AUDIT LOGS
-- ===================================================================
CREATE TABLE audit_logs (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id     UUID,
    actor_id      UUID,
    target_table  TEXT,
    target_id     UUID,
    action        TEXT,
    old_data      JSONB,
    new_data      JSONB,
    created_at    TIMESTAMP DEFAULT now()
);
-- ===================================================================
-- 10. SUBSCRIPTION PLANS
-- ===================================================================
CREATE TABLE subscription_plans (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(100) NOT NULL,
    description          text,
    price_per_month      numeric(10,2) NOT NULL DEFAULT 0,
    price_per_employee   numeric(10,2) NOT NULL DEFAULT 0,
    max_employees        int,
    features             jsonb,
    plan_type            plan_type_enum NOT NULL DEFAULT 'MONTHLY',
    billing_cycle_months int NOT NULL DEFAULT 1,
    currency             varchar(10) NOT NULL DEFAULT 'INR',
    -- Trial period support
    trial_duration_days  int DEFAULT 14,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    created_by   uuid,
    updated_by   uuid
);

-- ===================================================================
-- 11. TENANT SUBSCRIPTIONS
-- ===================================================================
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
-- ===================================================================
-- 12. ENABLE RLS
-- ===================================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscription ENABLE ROW LEVEL SECURITY;
-- ===================================================================
-- 13. RLS CONTEXT FUNCTIONS
-- ===================================================================

CREATE OR REPLACE FUNCTION current_tenant()
RETURNS UUID LANGUAGE sql AS $$
    SELECT current_setting('app.tenant_id', true)::uuid;
$$;

CREATE OR REPLACE FUNCTION current_app_role()
RETURNS TEXT LANGUAGE sql AS $$
    SELECT current_setting('app.role', true);
$$;

-- ===================================================================
-- 14. RLS POLICIES (FINAL)
-- ===================================================================

-- TENANTS (super admin only)
CREATE POLICY tenants_superadmin ON tenants
    FOR ALL
    USING (current_app_role() = 'SUPER_ADMIN');

-- USERS
CREATE POLICY users_rls ON users
    FOR ALL
    USING (
        current_app_role() = 'SUPER_ADMIN'
        OR tenant_id = current_tenant()
    );

-- EMPLOYEES
CREATE POLICY employees_rls ON employees
    FOR ALL
    USING (
        current_app_role() = 'SUPER_ADMIN'
        OR tenant_id = current_tenant()
    );

-- DEPARTMENTS
CREATE POLICY departments_rls ON departments
    FOR ALL
    USING (
        current_app_role() = 'SUPER_ADMIN'
        OR tenant_id = current_tenant()
    );

-- DESIGNATIONS
CREATE POLICY designations_rls ON designations
    FOR ALL
    USING (
        current_app_role() = 'SUPER_ADMIN'
        OR tenant_id = current_tenant()
    );

-- USER SESSIONS
CREATE POLICY sessions_rls ON user_sessions
    FOR ALL
    USING (
        current_app_role() = 'SUPER_ADMIN'
        OR tenant_id = current_tenant()
    );

-- AUDIT LOGS
CREATE POLICY audit_logs_rls ON audit_logs
    FOR ALL
    USING (
        current_app_role() = 'SUPER_ADMIN'
        OR tenant_id = current_tenant()
    );

-- SUPER ADMIN FULL ACCESS
CREATE POLICY subscription_plans_super_admin_policy
ON subscription_plans
AS PERMISSIVE
FOR ALL
TO public
USING (current_app_role() = 'SUPER_ADMIN')
WITH CHECK (current_app_role() = 'SUPER_ADMIN');

-- INSERT policy (SUPER_ADMIN only)
CREATE POLICY subscription_plans_insert_policy
ON subscription_plans
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (current_app_role() = 'SUPER_ADMIN');

-- READ policy (everyone can read)
CREATE POLICY subscription_plans_read_policy
ON subscription_plans
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- SUPER_ADMIN read/write policy
CREATE POLICY subscription_plans_rw_policy
ON subscription_plans
AS PERMISSIVE
FOR ALL
TO public
USING (current_app_role() = 'SUPER_ADMIN')
WITH CHECK (current_app_role() = 'SUPER_ADMIN');

CREATE POLICY tenant_subscription_super_admin_policy
ON tenant_subscription
FOR ALL
USING (current_app_role() = 'SUPER_ADMIN')
WITH CHECK (current_app_role() = 'SUPER_ADMIN');

CREATE POLICY tenant_subscription_tenant_policy
ON tenant_subscription
FOR ALL
USING (
    tenant_id = current_tenant()
    AND current_app_role() IN ('ADMIN', 'HR')
)
WITH CHECK (
    tenant_id = current_tenant()
    AND current_app_role() IN ('ADMIN', 'HR')
);