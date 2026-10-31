import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Production's payload_migrations id sequence had fallen behind its rows, so
  // recording this migration collided with an existing id and rolled it back.
  // Resync it first; Payload inserts the record in this same transaction.
  await db.execute(sql`
   SELECT setval(pg_get_serial_sequence('payload_migrations', 'id'), (SELECT COALESCE(MAX("id"), 1) FROM "payload_migrations"));`)
  await db.execute(sql`
   ALTER TABLE "pages_blocks_industries_sectors" ADD COLUMN "href" varchar;
  ALTER TABLE "pages_blocks_industries_sectors" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_logo_wall_logos" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_industries_sectors" ADD COLUMN "href" varchar;
  ALTER TABLE "_pages_v_blocks_industries_sectors" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" ADD COLUMN "description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_industries_sectors" DROP COLUMN "href";
  ALTER TABLE "pages_blocks_industries_sectors" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_logo_wall_logos" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_industries_sectors" DROP COLUMN "href";
  ALTER TABLE "_pages_v_blocks_industries_sectors" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" DROP COLUMN "description";`)
}
