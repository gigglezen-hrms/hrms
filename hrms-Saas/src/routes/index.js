const express = require('express');
const dbSessionContext = require('../middleware/dbSessionContext');

const authRoutes = require('../modules/auth/auth.router');

const router = express.Router();
router.use(dbSessionContext);
router.use('/auth', authRoutes);

module.exports = router;
