import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
