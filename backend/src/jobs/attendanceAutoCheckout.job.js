// src/jobs/attendanceAutoCheckout.job.js
const cron = require('node-cron');
const pool = require('../config/db');
const logger = require('../config/logger');
const moment = require('moment');

/**
 * Auto-checkout job
 * Automatically checks out employees who forgot to check out
 * Runs daily at 11:59 PM
 */
const attendanceAutoCheckout = cron.schedule(
    '59 23 * * *', // Run at 11:59 PM every day
    async () => {
        try {
            logger.info('Running attendance auto-checkout job...');

            const today = moment().format('YYYY-MM-DD');

            // Find attendance records with check-in but no check-out
            const result = await pool.query(
                `UPDATE attendance
                 SET check_out_time = '23:59:00',
                     total_hours = EXTRACT(EPOCH FROM (
                         (date + TIME '23:59:00') - (date + check_in_time)
                     )) / 3600,
                     remarks = COALESCE(remarks  '  ', '')  'Auto-checkout at end of day',
                     updated_at = NOW()
                 WHERE date = $1
                   AND check_in_time IS NOT NULL
                   AND check_out_time IS NULL
                 RETURNING id, employee_id, check_in_time`,
                [today]
            );

            if (result.rowCount > 0) {
                logger.info(`Auto-checked out ${result.rowCount} employees for ${today}`);

                // Log each auto-checkout
                result.rows.forEach(row => {
                    logger.debug(`Auto-checkout: Employee ${row.employee_id}, Check-in: ${row.check_in_time}`);
                });
            } else {
                logger.info(`No employees to auto-checkout for ${today}`);
            }

        } catch (error) {
            logger.error('Error in attendance auto-checkout job:', error);
        }
    },
    {
        scheduled: false, // Don't start automatically
        timezone: process.env.TZ  'Asia/Kolkata'
    }
);

module.exports = attendanceAutoCheckout;
