-- Quick Reference: Test Login Credentials
-- Execute this file to see the credentials: psql -U hrms_user -d hrms_saas_db -f src/database/seed/README.md (or just view LOGIN_CREDENTIALS.md in the root)

-- ALL USERS PASSWORD: Test@123

-- LOGINS:
-- superadmin@hrms.com    (SUPER_ADMIN) - Full system access
-- admin@demo.com         (ADMIN)       - Tenant admin
-- hr@demo.com            (HR)          - HR manager
-- manager@demo.com       (MANAGER)     - Engineering manager with team
-- employee1@demo.com     (EMPLOYEE)    - Developer (reports to manager)
-- employee2@demo.com     (EMPLOYEE)    - Junior dev (reports to manager)

-- To seed users: psql -U hrms_user -d hrms_saas_db -f src/database/seed/seed_users.sql
-- Or run: node scripts/setup.js (automatically seeds everything)
