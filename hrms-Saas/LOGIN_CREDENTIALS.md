# HRMS SaaS - Test Login Credentials

## Default Password
**Password for ALL test users: `Test@123`**

---

## Available Test Users

### 1. Super Administrator
- **Email:** `superadmin@hrms.com`
- **Role:** SUPER_ADMIN
- **Access:** Full system access across all tenants
- **Note:** No tenant association

### 2. Administrator
- **Email:** `admin@demo.com`
- **Role:** ADMIN
- **Name:** John Admin
- **Employee Code:** EMP001
- **Designation:** CEO
- **Department:** Engineering
- **Tenant:** Demo Company

### 3. Human Resources
- **Email:** `hr@demo.com`
- **Role:** HR
- **Name:** Sarah HR
- **Employee Code:** EMP002
- **Designation:** HR Manager
- **Department:** Human Resources
- **Reports To:** John Admin (CEO)
- **Tenant:** Demo Company

### 4. Manager
- **Email:** `manager@demo.com`
- **Role:** MANAGER
- **Name:** Mike Manager
- **Employee Code:** EMP003
- **Designation:** Engineering Manager
- **Department:** Engineering
- **Reports To:** John Admin (CEO)
- **Team Members:** Alice Developer, Bob Junior
- **Tenant:** Demo Company

### 5. Employee 1
- **Email:** `employee1@demo.com`
- **Role:** EMPLOYEE
- **Name:** Alice Developer
- **Employee Code:** EMP004
- **Designation:** Software Engineer
- **Department:** Engineering
- **Reports To:** Mike Manager
- **Tenant:** Demo Company

### 6. Employee 2
- **Email:** `employee2@demo.com`
- **Role:** EMPLOYEE
- **Name:** Bob Junior
- **Employee Code:** EMP005
- **Designation:** Junior Developer
- **Department:** Engineering
- **Reports To:** Mike Manager
- **Tenant:** Demo Company

---

## Organizational Structure

```
Demo Company
├── John Admin (CEO) - ADMIN
    ├── Sarah HR (HR Manager) - HR
    └── Mike Manager (Engineering Manager) - MANAGER
        ├── Alice Developer (Software Engineer) - EMPLOYEE
        └── Bob Junior (Junior Developer) - EMPLOYEE
```

---

## Testing Different Roles

### Super Admin Testing
- Login with `superadmin@hrms.com`
- Test cross-tenant operations
- Manage tenants and global settings
- Full system access

### Admin Testing
- Login with `admin@demo.com`
- Manage all users, employees, and settings within Demo Company
- Create/update/delete employees
- View all reports and analytics

### HR Testing
- Login with `hr@demo.com`
- Manage employee records
- Approve/reject leave requests
- View HR-specific reports
- Limited administrative access

### Manager Testing
- Login with `manager@demo.com`
- View team members (Alice & Bob)
- Approve/reject team leave requests
- Mark team attendance
- View team reports

### Employee Testing
- Login with `employee1@demo.com` or `employee2@demo.com`
- Mark own attendance
- Apply for leave
- View own records
- Upload documents

---

## Quick Start

1. Run the setup script:
   ```bash
   node scripts/setup.js
   ```

2. Or manually seed the users:
   ```bash
   psql -U hrms_user -d hrms_saas_db_db -f src/database/seed/seed_users.sql
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

4. Login at: `http://localhost:5000/api/auth/login`

---

## API Testing Examples

### Login Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "Test@123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Security Notes

⚠️ **IMPORTANT:** These are test credentials for development only!
- Change passwords in production
- Remove test users before deploying to production
- Use strong, unique passwords for production accounts
- Enable additional security measures (2FA, IP whitelisting, etc.)

---

## Database Seed Details

The seed file creates:
- 1 Demo tenant
- 1 Trial subscription plan
- 3 Departments (Engineering, Human Resources, Sales)
- 5 Designations (CEO, HR Manager, Engineering Manager, Software Engineer, Junior Developer)
- 6 Users (1 Super Admin + 5 tenant users)
- 5 Employee records (all except Super Admin)

All seed data uses fixed UUIDs for consistency and easy testing.
