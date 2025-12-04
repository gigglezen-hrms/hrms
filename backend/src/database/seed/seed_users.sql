BEGIN;

INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    role,
    is_active,
    must_change_password,
    created_by
)
VALUES (
    NULL,
    'sirsn11@gmail.com',
    crypt('SuperAdmin@123', gen_salt('bf')),
    'SUPER_ADMIN',
    TRUE,
    FALSE,
    NULL
)
ON CONFLICT (tenant_id, email)
DO NOTHING;

COMMIT;
