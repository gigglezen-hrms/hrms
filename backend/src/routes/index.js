const express = require('express');

const dbSessionContext = require('../middleware/dbSessionContext');
const verifyJwt = require('../middleware/verifyJwt');     
const requireRole = require('../middleware/requireRole');

// module routers
const authRoutes = require('../modules/auth/auth.router');
const tenantRouter = require('../modules/tenant/tenant.router');
const adminRouter = require('../modules/admin/admin.router');
const superAdminRouter = require('../modules/super_admin/superAdmin.router');
const departmentRouter = require('../modules/departments/department.router');
const subscriptionRouter = require('../modules/subscriptions/subscription.routes');

const router = express.Router();

// Always attach RLS/ALS context
router.use(dbSessionContext);

// Public routes
router.use('/auth', authRoutes);

// Tenant module
router.use('/tenants', tenantRouter);

// Everything below requires authentication
router.use(verifyJwt);



// Admin module (ADMIN, HR, or SUPER_ADMIN)
router.use('/admin', requireRole(['ADMIN', 'HR', 'SUPER_ADMIN']), adminRouter);

// Super admin module
router.use('/super-admin', requireRole(['SUPER_ADMIN']), superAdminRouter);

// Department module (ADMIN, HR)
router.use('/departments', departmentRouter);


// User module (ADMIN, HR)
router.use('/users', requireRole(['ADMIN', 'HR']), require('./../modules/users/user.router'));

// Subscription module (ADMIN, HR, SUPER_ADMIN)
router.use('/subscriptions', requireRole(['ADMIN', 'HR', 'SUPER_ADMIN']), subscriptionRouter);

module.exports = router;
