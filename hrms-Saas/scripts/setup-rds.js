#!/usr/bin/env node

require("dotenv").config();

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return true;
  } catch (error) {
    return false;
  }
}

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function checkPrerequisites() {
  log('\n[1/3] Checking prerequisites...', 'yellow');

  if (!execCommand('node --version', { silent: true })) {
    log('❌ Node.js not found!', 'red');
    process.exit(1);
  }
  log('✓ Node.js installed', 'green');

  if (!execCommand('npm --version', { silent: true })) {
    log('❌ npm not found!', 'red');
    process.exit(1);
  }
  log('✓ npm installed', 'green');

  if (!execCommand('psql --version', { silent: true })) {
    log('❌ PostgreSQL not found!', 'red');
    process.exit(1);
  }
  log('✓ PostgreSQL installed', 'green');

  if (execCommand('redis-cli --version', { silent: true })) {
    log('✓ Redis installed (optional)', 'green');
  } else {
    log('⚠ Redis not found (optional)', 'yellow');
  }

  if (execCommand('rabbitmqctl version', { silent: true })) {
    log('✓ RabbitMQ installed (optional)', 'green');
  } else {
    log('⚠ RabbitMQ not found (optional)', 'yellow');
  }

  console.log('');
}

async function setupEnvironment() {
  log('[2/3] Setting up environment...', 'yellow');

  log('Installing npm packages...', 'blue');
  if (!execCommand('npm install')) {
    log('❌ Failed to install dependencies!', 'red');
    process.exit(1);
  }
  log('✓ Dependencies installed', 'green');

  if (!fs.existsSync('.env.prod')) {
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env.prod');
      log('✓ Created .env.prod from template', 'green');
      log('\n⚠ Edit .env with your DB credentials and secrets.', 'yellow');
      await question('\nPress Enter after editing .env...');
    } else {
      log('❌ .env.example missing!', 'red');
      process.exit(1);
    }
  } else {
    log('✓ .env found', 'green');
  }

  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
    log('✓ Created logs directory', 'green');
  } else {
    log('✓ Logs directory exists', 'green');
  }

  console.log('');
}

async function setupDatabase() {
  log('[3/3] Setting up database...', 'yellow');

  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = process.env.DB_PORT  5432;
  const DB_USER = process.env.DB_USER;
  const DB_NAME = process.env.DB_NAME;
  const DB_PASSWORD = process.env.DB_PASSWORD;

  // Set PGPASSWORD so psql doesn't ask for password
  if (DB_PASSWORD) {
    process.env.PGPASSWORD = DB_PASSWORD;
  }

  if (!DB_HOST!DB_USER!DB_NAME) {
    log('❌ Missing DB_HOST / DB_USER / DB_NAME in .env', 'red');
    process.exit(1);
  }

  log(`Using DB host: ${DB_HOST}`, 'blue');

  // RUN setup.sql
  log('Running setup-rds.sql...', 'blue');
  const setupCmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d postgres -f database/setup-rds.sql`;

  if (!execCommand(setupCmd)) {
    log('❌ Failed running setup-rds.sql (check RDS/local Postgres permissions)', 'red');
    process.exit(1);
  }
  log('✓ setup-rds.sql executed', 'green');

  // MIGRATIONS
  log('Running migrations...', 'blue');
  const migrations = [
    'database/migrations/001_initial_schema.sql',
    'database/migrations/002_add_approval_columns.sql',
    'database/migrations/003_add_half_day_type_to_leave_requests.sql',
    'database/migrations/004_add_half_day_to_leaves.sql',
    'database/migrations/005_attendance_enhancements.sql',
    'database/migrations/006_deprecate_geolocation.sql',
    'database/migrations/007_fix_total_days_decimal.sql',
    'database/migrations/008_production_fixes.sql'
  ];

  for (const migration of migrations) {
    if (fs.existsSync(migration)) {
      const file = path.basename(migration);
      const cmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${migration}`;
      execCommand(cmd);
      log(`  ✓ ${file}`, 'green');
    }
  }

  // SEEDERS
  log('Seeding data...', 'blue');
  const seedFiles = fs.readdirSync('database/seeders')
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const seed of seedFiles) {
    const seedPath = `database/seeders/${seed}`;
    const cmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${seedPath}`;

    if (!execCommand(cmd)) {
      log(`❌ Failed seeding ${seed}`, 'red');
      process.exit(1);
    }

    log(`  ✓ ${seed}`, 'green');
  }

  console.log('');
}

async function main() {
  console.log('\n========================================');
  log('  HRMS Backend - Automated Setup', 'green');
  console.log('========================================');

  try {
    await checkPrerequisites();
    await setupEnvironment();
    await setupDatabase();

    console.log('========================================');
    log('  ✓ Setup Completed Successfully!', 'green');
    console.log('========================================\n');

    console.log('Next steps:');
    console.log('  1. Start server: npm start');
    console.log('  2. Test API: curl http://localhost:5000/api/health');

    const startNow = await question('Start server now? (y/n): ');
    rl.close();

    if (startNow.toLowerCase() === 'y'  startNow.toLowerCase() === 'yes') {
      log('\nStarting server...\n', 'blue');
      execCommand('npm run dev');
    } else {
      log('\nRun "npm start" when ready.', 'blue');
    }

  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
  }
}

main();
