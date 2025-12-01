-- Database Setup Script
-- Run this with postgres superuser to create database and user

-- Create database if not exists
SELECT 'CREATE DATABASE hrms_saas_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hrms_saas_db')\gexec

-- Create user if not exists
DO
$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'hrms_user') THEN
    CREATE USER hrms_user WITH PASSWORD 'postgres';
  END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hrms_saas_db TO hrms_user;

-- Connect to the database to grant schema privileges
\c hrms_saas_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO hrms_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hrms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hrms_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hrms_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hrms_user;
