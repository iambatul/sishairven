#!/bin/bash
# =============================================================================
# HAIRVEN DATABASE MIGRATION SCRIPT
# =============================================================================
# Manages database migrations for SQLite
# Usage: ./database/migrate.sh [command] [options]
# Commands:
#   up          Run all pending migrations
#   down        Rollback last migration
#   status      Show migration status
#   create      Create a new migration file
#   backup      Create database backup
# =============================================================================

set -euo pipefail

# Configuration
DB_PATH="${DB_PATH:-/data/appointments.db}"
MIGRATIONS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/migrations"
BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/backups"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Ensure database directory exists
ensure_db_dir() {
    local db_dir=$(dirname "$DB_PATH")
    if [[ ! -d "$db_dir" ]]; then
        log_info "Creating database directory: $db_dir"
        mkdir -p "$db_dir"
    fi
}

# Create migration tracking table
init_migrations() {
    sqlite3 "$DB_PATH" "CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        description TEXT
    );" 2>/dev/null || true
}

# Get list of applied migrations
get_applied_migrations() {
    sqlite3 "$DB_PATH" "SELECT version FROM schema_migrations ORDER BY version;" 2>/dev/null || true
}

# Get list of pending migrations
get_pending_migrations() {
    local applied=$(get_applied_migrations)
    local all_migrations=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort | xargs -n1 basename | sed 's/.sql$//')
    
    for migration in $all_migrations; do
        if ! echo "$applied" | grep -q "^${migration}$"; then
            echo "$migration"
        fi
    done
}

# Run migrations
migrate_up() {
    log_info "Running pending migrations..."
    ensure_db_dir
    init_migrations
    
    local pending=$(get_pending_migrations)
    
    if [[ -z "$pending" ]]; then
        log_success "No pending migrations"
        return 0
    fi
    
    for migration in $pending; do
        local file="$MIGRATIONS_DIR/${migration}.sql"
        
        if [[ ! -f "$file" ]]; then
            log_error "Migration file not found: $file"
            continue
        fi
        
        log_info "Applying migration: $migration"
        
        if sqlite3 "$DB_PATH" < "$file"; then
            log_success "Applied: $migration"
        else
            log_error "Failed to apply: $migration"
            return 1
        fi
    done
    
    log_success "All migrations applied successfully"
}

# Show migration status
migrate_status() {
    log_info "Migration Status"
    echo "================"
    echo ""
    echo "Database: $DB_PATH"
    echo ""
    
    local applied=$(get_applied_migrations)
    local pending=$(get_pending_migrations)
    
    echo "Applied migrations:"
    if [[ -z "$applied" ]]; then
        echo "  (none)"
    else
        echo "$applied" | sed 's/^/  ✓ /'
    fi
    
    echo ""
    echo "Pending migrations:"
    if [[ -z "$pending" ]]; then
        echo "  (none)"
    else
        echo "$pending" | sed 's/^/  ○ /'
    fi
}

# Create new migration
create_migration() {
    local name="${1:-}"
    
    if [[ -z "$name" ]]; then
        log_error "Migration name required"
        echo "Usage: $0 create <migration_name>"
        exit 1
    fi
    
    # Generate version number
    local version=$(date +%Y%m%d%H%M%S)
    local filename="${version}_${name}.sql"
    local filepath="$MIGRATIONS_DIR/$filename"
    
    mkdir -p "$MIGRATIONS_DIR"
    
    cat > "$filepath" << EOF
-- Migration: ${version}_${name}
-- Description: ${name//_/ }
-- Created: $(date -Iseconds)

-- TODO: Add your migration SQL here

-- Track migration
INSERT INTO schema_migrations (version, description) 
VALUES ('${version}_${name}', '${name//_/ }');
EOF
    
    log_success "Created migration: $filepath"
}

# Create backup
backup_database() {
    mkdir -p "$BACKUP_DIR"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/appointments_${timestamp}.db"
    
    if [[ -f "$DB_PATH" ]]; then
        cp "$DB_PATH" "$backup_file"
        log_success "Backup created: $backup_file"
        
        # Cleanup old backups (keep last 10)
        ls -t "$BACKUP_DIR"/*.db 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
    else
        log_warning "Database file not found: $DB_PATH"
    fi
}

# Show help
show_help() {
    cat << EOF
Hairven Database Migration Tool

Usage: $0 [command] [options]

Commands:
  up              Run all pending migrations
  status          Show migration status
  create <name>   Create a new migration file
  backup          Create database backup
  help            Show this help message

Environment Variables:
  DB_PATH         Path to SQLite database (default: /data/appointments.db)

Examples:
  $0 up                    # Run all pending migrations
  $0 status                # Show migration status
  $0 create add_users      # Create new migration
  $0 backup                # Create database backup

EOF
}

# Main
main() {
    local command="${1:-help}"
    
    case "$command" in
        up)
            migrate_up
            ;;
        status)
            migrate_status
            ;;
        create)
            create_migration "$2"
            ;;
        backup)
            backup_database
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
