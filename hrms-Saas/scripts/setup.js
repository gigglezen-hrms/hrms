require("dotenv").config();

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  console.log('\n[1/3] Checking prerequisites...');

  if (!execCommand('node --version', { silent: true })) {
    console.error('Node.js not found! Install from: https://nodejs.org/');
    process.exit(1);
  }
  console.log('✓ Node.js installed');

  if (!execCommand('npm --version', { silent: true })) {
    console.error('npm not found!');
    process.exit(1);
  }
  console.log('✓ npm installed');

  if (!execCommand('psql --version', { silent: true })) {
    console.error('PostgreSQL not found! Install from: https://www.postgresql.org/');
    process.exit(1);
  }
  console.log('✓ PostgreSQL installed\n');
}

async function setupEnvironment() {
  console.log('[2/3] Setting up environment...');

  console.log('Installing npm packages...');
  if (!execCommand('npm install')) {
    console.error('Failed to install dependencies!');
    process.exit(1);
  }
  console.log('✓ Dependencies installed');

  if (!fs.existsSync('.env')) {
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      console.log('✓ Created .env from template');
      console.log('\nIMPORTANT: Edit .env with your configuration:');
      console.log('  - DATABASE_URL');
      console.log('  - JWT_ACCESS_SECRET and JWT_REFRESH_SECRET');
      console.log('  - SMTP credentials');
      await question('\nPress Enter when done editing .env...');
      require("dotenv").config();
    } else {
      console.error('.env.example not found!');
      process.exit(1);
    }
  } else {
    console.log('✓ .env file found');
  }

  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
    console.log('✓ Logs directory created');
  } else {
    console.log('✓ Logs directory exists');
  }

  console.log('');
}

async function setupDatabase() {
  console.log('[3/3] Setting up database...');

  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = process.env.DB_PORT || 5432;
  const DB_USER = process.env.DB_USER || 'hrms_user';
  const DB_NAME = process.env.DB_NAME || 'hrms_saas_db_db';
  const DB_PASSWORD = process.env.DB_PASSWORD;

  if (DB_PASSWORD) {
    process.env.PGPASSWORD = DB_PASSWORD;
  }

  const isWindows = process.platform === 'win32';
  const SETUP_USER = 'postgres';

  // Step 1: Create database and user with setup.sql
  console.log('Creating database and user...');

  let setupCmd;
  if (process.env.DB_HOST) {
    setupCmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${SETUP_USER} -d postgres -f src/database/setup.sql`;
  } else {
    setupCmd = isWindows
      ? `psql -U ${SETUP_USER} -f src/database/setup.sql`
      : `sudo -u ${SETUP_USER} psql -f src/database/setup.sql`;
  }

  if (!execCommand(setupCmd)) {
    console.error('Database setup failed!');
    process.exit(1);
  }
  console.log('✓ Database and user created');

  // Step 2: Run schema with DB_USER
  console.log('Running database schema...');

  let schemaCmd;
  if (process.env.DB_HOST) {
    schemaCmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f src/database/schema.sql`;
  } else {
    schemaCmd = isWindows
      ? `psql -U ${DB_USER} -d ${DB_NAME} -f src/database/schema.sql`
      : `psql -U ${DB_USER} -d ${DB_NAME} -f src/database/schema.sql`;
  }

  if (!execCommand(schemaCmd)) {
    console.error('Database schema creation failed!');
    process.exit(1);
  }
  console.log('✓ Schema created');

  // Step 3: Seed initial data
  console.log('Seeding initial data...');
  const seedPath = 'src/database/seed/seed_initial_roles.sql';

  if (fs.existsSync(seedPath)) {
    let seedCmd;
    if (process.env.DB_HOST) {
      seedCmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${seedPath}`;
    } else {
      seedCmd = isWindows
        ? `psql -U ${DB_USER} -d ${DB_NAME} -f ${seedPath}`
        : `psql -U ${DB_USER} -d ${DB_NAME} -f ${seedPath}`;
    }

    if (!execCommand(seedCmd)) {
      console.error('Seeding failed!');
      process.exit(1);
    }
    console.log('✓ Initial roles seeded');
  } else {
    console.log('No seed file found');
  }

  // Step 4: Seed test users
  console.log('Seeding test users...');
  const userSeedPath = 'src/database/seed/seed_users.sql';

  if (fs.existsSync(userSeedPath)) {
    let userSeedCmd;
    if (process.env.DB_HOST) {
      userSeedCmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${userSeedPath}`;
    } else {
      userSeedCmd = isWindows
        ? `psql -U ${DB_USER} -d ${DB_NAME} -f ${userSeedPath}`
        : `psql -U ${DB_USER} -d ${DB_NAME} -f ${userSeedPath}`;
    }

    if (!execCommand(userSeedCmd)) {
      console.error('User seeding failed!');
      process.exit(1);
    }
    console.log('✓ Test users seeded');
  } else {
    console.log('No user seed file found');
  }

  console.log('');
}

async function main() {
  try {
    await checkPrerequisites();
    await setupEnvironment();
    await setupDatabase();

    console.log('Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. Start server: npm run dev');

    const startNow = await question('\nStart server now? (y/n): ');
    rl.close();

    if (startNow.toLowerCase() === 'y' || startNow.toLowerCase() === 'yes') {
      console.log('\nStarting server...\n');
      execCommand('npm run dev');
    } else {
      console.log('\nRun "npm run dev" when ready to start the server.');
    }

  } catch (error) {
    console.error(`\nFatal error: ${error.message}`);
    rl.close();
    process.exit(1);
  }
}

main();
