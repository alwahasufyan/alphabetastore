#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  PostgreSQL daily backup script
#
#  Usage (standalone):
#    PGPASSWORD=secret POSTGRES_USER=alphabeta POSTGRES_DB=alphabeta \
#      BACKUP_DIR=/backups ./scripts/backup-db.sh
#
#  Cron (run every day at 02:00):
#    0 2 * * * /path/to/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
#
#  The script keeps the last RETENTION_DAYS backups and deletes the rest.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:?POSTGRES_USER is required}"
POSTGRES_DB="${POSTGRES_DB:?POSTGRES_DB is required}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

mkdir -p "${BACKUP_DIR}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${POSTGRES_DB}-${TIMESTAMP}.sql.gz"

echo "[$(date -Iseconds)] Starting backup: ${BACKUP_FILE}"

pg_dump \
  -h "${POSTGRES_HOST}" \
  -p "${POSTGRES_PORT}" \
  -U "${POSTGRES_USER}" \
  "${POSTGRES_DB}" \
  | gzip > "${BACKUP_FILE}"

echo "[$(date -Iseconds)] Backup complete: $(du -sh "${BACKUP_FILE}" | cut -f1)"

# Remove backups older than RETENTION_DAYS days
# find -mtime +N means "modified more than N days ago" (i.e. at least N+1 days old)
# so we use +(RETENTION_DAYS-1) to delete files strictly older than RETENTION_DAYS
find "${BACKUP_DIR}" -name "${POSTGRES_DB}-*.sql.gz" -mtime +"$((RETENTION_DAYS - 1))" -delete
echo "[$(date -Iseconds)] Cleanup: removed backups older than ${RETENTION_DAYS} days"
