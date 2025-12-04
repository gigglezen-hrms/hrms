-- ===================================================================
-- HRMS SAAS - MASTER SCHEMA (FINAL WORKING VERSION)
-- ===================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
-- 10. ENABLE RLS
-- ===================================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- 11. RLS CONTEXT FUNCTIONS
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
-- 12. RLS POLICIES (FINAL)
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
