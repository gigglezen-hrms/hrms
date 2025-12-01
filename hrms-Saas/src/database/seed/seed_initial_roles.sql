

-- Insert initial roles
INSERT INTO roles (code, name, description) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Full system access across all tenants'),
('ADMIN', 'Administrator', 'Full access within tenant organization'),
('HR', 'Human Resources', 'HR management and employee operations'),
('MANAGER', 'Manager', 'Team management and reporting access'),
('EMPLOYEE', 'Employee', 'Basic employee self-service access')
ON CONFLICT (code) DO NOTHING;

-- Insert permissions
INSERT INTO permissions (code, description) VALUES
-- Tenant Management
('tenant.create', 'Create new tenants'),
('tenant.read', 'View tenant information'),
('tenant.update', 'Update tenant settings'),
('tenant.delete', 'Delete tenants'),

-- User Management
('user.create', 'Create new users'),
('user.read', 'View user information'),
('user.update', 'Update user details'),
('user.delete', 'Delete users'),

-- Employee Management
('employee.create', 'Create new employees'),
('employee.read', 'View employee information'),
('employee.update', 'Update employee details'),
('employee.delete', 'Delete employees'),

-- Attendance Management
('attendance.create', 'Mark attendance'),
('attendance.read', 'View attendance records'),
('attendance.update', 'Update attendance'),
('attendance.delete', 'Delete attendance records'),
('attendance.approve', 'Approve attendance regularization'),

-- Leave Management
('leave.create', 'Apply for leave'),
('leave.read', 'View leave requests'),
('leave.update', 'Update leave requests'),
('leave.delete', 'Cancel leave requests'),
('leave.approve', 'Approve/reject leave requests'),

-- Department Management
('department.create', 'Create departments'),
('department.read', 'View departments'),
('department.update', 'Update departments'),
('department.delete', 'Delete departments'),

-- Designation Management
('designation.create', 'Create designations'),
('designation.read', 'View designations'),
('designation.update', 'Update designations'),
('designation.delete', 'Delete designations'),

-- Shift Management
('shift.create', 'Create shifts'),
('shift.read', 'View shifts'),
('shift.update', 'Update shifts'),
('shift.delete', 'Delete shifts'),

-- Document Management
('document.create', 'Upload documents'),
('document.read', 'View documents'),
('document.update', 'Update documents'),
('document.delete', 'Delete documents'),

-- Reports
('report.view', 'View reports'),
('report.export', 'Export reports'),

-- Subscription Management
('subscription.read', 'View subscription details'),
('subscription.update', 'Manage subscriptions')
ON CONFLICT (code) DO NOTHING;

-- Assign permissions to SUPER_ADMIN (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- Assign permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'user.create', 'user.read', 'user.update', 'user.delete',
    'employee.create', 'employee.read', 'employee.update', 'employee.delete',
    'attendance.create', 'attendance.read', 'attendance.update', 'attendance.delete', 'attendance.approve',
    'leave.create', 'leave.read', 'leave.update', 'leave.delete', 'leave.approve',
    'department.create', 'department.read', 'department.update', 'department.delete',
    'designation.create', 'designation.read', 'designation.update', 'designation.delete',
    'shift.create', 'shift.read', 'shift.update', 'shift.delete',
    'document.create', 'document.read', 'document.update', 'document.delete',
    'report.view', 'report.export',
    'subscription.read', 'subscription.update'
)
WHERE r.code = 'ADMIN'
ON CONFLICT DO NOTHING;

-- Assign permissions to HR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'employee.create', 'employee.read', 'employee.update',
    'attendance.read', 'attendance.approve',
    'leave.read', 'leave.approve',
    'department.read', 'designation.read', 'shift.read',
    'document.create', 'document.read', 'document.update',
    'report.view', 'report.export'
)
WHERE r.code = 'HR'
ON CONFLICT DO NOTHING;

-- Assign permissions to MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'employee.read',
    'attendance.read', 'attendance.approve',
    'leave.read', 'leave.approve',
    'department.read', 'designation.read', 'shift.read',
    'document.read',
    'report.view'
)
WHERE r.code = 'MANAGER'
ON CONFLICT DO NOTHING;

-- Assign permissions to EMPLOYEE
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'attendance.create', 'attendance.read',
    'leave.create', 'leave.read', 'leave.update',
    'document.read',
    'employee.read'
)
WHERE r.code = 'EMPLOYEE'
ON CONFLICT DO NOTHING;
