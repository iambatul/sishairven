-- Migration: 001_initial
-- Description: Initial database schema creation
-- Created: 2026-02-10

-- This migration creates the initial database schema for Hairven Salon
-- Run this migration first before any other database operations

.read ../schema.sql

-- Migration tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_migrations (version, description) 
VALUES ('001_initial', 'Initial database schema');
