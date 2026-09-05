import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_service_index_groups_services_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_service_index_groups_icon_name" AS ENUM('refresh', 'cpu', 'gauge', 'cabinet', 'cog', 'network', 'signal', 'shield');
  CREATE TYPE "public"."enum_pages_blocks_industries_display" AS ENUM('track', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_stats_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_contact_details_icon_name" AS ENUM('phone', 'email', 'location', 'clock');
  CREATE TYPE "public"."enum__pages_v_blocks_service_index_groups_services_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_service_index_groups_icon_name" AS ENUM('refresh', 'cpu', 'gauge', 'cabinet', 'cog', 'network', 'signal', 'shield');
  CREATE TYPE "public"."enum__pages_v_blocks_industries_display" AS ENUM('track', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_details_icon_name" AS ENUM('phone', 'email', 'location', 'clock');
  ALTER TYPE "public"."enum_pages_blocks_industries_sectors_icon_name" ADD VALUE 'automotive';
  ALTER TYPE "public"."enum_pages_blocks_industries_sectors_icon_name" ADD VALUE 'construction';
  ALTER TYPE "public"."enum__pages_v_blocks_industries_sectors_icon_name" ADD VALUE 'automotive';
  ALTER TYPE "public"."enum__pages_v_blocks_industries_sectors_icon_name" ADD VALUE 'construction';
  CREATE TABLE "pages_blocks_service_index_groups_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_service_index_groups_services_link_type" DEFAULT 'reference',
  	"link_label" varchar,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_service_index_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon_name" "enum_pages_blocks_service_index_groups_icon_name" DEFAULT 'cog'
  );
  
  CREATE TABLE "pages_blocks_service_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_stats_tone" DEFAULT 'light',
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_name" "enum_pages_blocks_contact_details_icon_name" DEFAULT 'phone',
  	"label" varchar,
  	"value" varchar,
  	"href" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"form_note" varchar,
  	"map_heading" varchar,
  	"map_intro" varchar,
  	"map_embed_url" varchar,
  	"map_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_index_groups_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_service_index_groups_services_link_type" DEFAULT 'reference',
  	"link_label" varchar,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_index_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon_name" "enum__pages_v_blocks_service_index_groups_icon_name" DEFAULT 'cog',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"tone" "enum__pages_v_blocks_stats_tone" DEFAULT 'light',
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_name" "enum__pages_v_blocks_contact_details_icon_name" DEFAULT 'phone',
  	"label" varchar,
  	"value" varchar,
  	"href" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"form_note" varchar,
  	"map_heading" varchar,
  	"map_intro" varchar,
  	"map_embed_url" varchar,
  	"map_link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "collapsible" SET DEFAULT true;
  ALTER TABLE "_pages_v_blocks_rich_text" ALTER COLUMN "collapsible" SET DEFAULT true;
  ALTER TABLE "pages_blocks_feature_grid" ADD COLUMN "footnote" varchar;
  ALTER TABLE "pages_blocks_industries" ADD COLUMN "display" "enum_pages_blocks_industries_display" DEFAULT 'track';
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD COLUMN "footnote" varchar;
  ALTER TABLE "_pages_v_blocks_industries" ADD COLUMN "display" "enum__pages_v_blocks_industries_display" DEFAULT 'track';
  ALTER TABLE "pages_blocks_service_index_groups_services" ADD CONSTRAINT "pages_blocks_service_index_groups_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_index_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_index_groups" ADD CONSTRAINT "pages_blocks_service_index_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_index" ADD CONSTRAINT "pages_blocks_service_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_details" ADD CONSTRAINT "pages_blocks_contact_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_index_groups_services" ADD CONSTRAINT "_pages_v_blocks_service_index_groups_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_index_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_index_groups" ADD CONSTRAINT "_pages_v_blocks_service_index_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_index" ADD CONSTRAINT "_pages_v_blocks_service_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_details" ADD CONSTRAINT "_pages_v_blocks_contact_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_service_index_groups_services_order_idx" ON "pages_blocks_service_index_groups_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_index_groups_services_parent_id_idx" ON "pages_blocks_service_index_groups_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_index_groups_order_idx" ON "pages_blocks_service_index_groups" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_index_groups_parent_id_idx" ON "pages_blocks_service_index_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_index_order_idx" ON "pages_blocks_service_index" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_index_parent_id_idx" ON "pages_blocks_service_index" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_index_path_idx" ON "pages_blocks_service_index" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_details_order_idx" ON "pages_blocks_contact_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_details_parent_id_idx" ON "pages_blocks_contact_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_service_index_groups_services_order_idx" ON "_pages_v_blocks_service_index_groups_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_index_groups_services_parent_id_idx" ON "_pages_v_blocks_service_index_groups_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_index_groups_order_idx" ON "_pages_v_blocks_service_index_groups" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_index_groups_parent_id_idx" ON "_pages_v_blocks_service_index_groups" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_index_order_idx" ON "_pages_v_blocks_service_index" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_index_parent_id_idx" ON "_pages_v_blocks_service_index" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_index_path_idx" ON "_pages_v_blocks_service_index" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_details_order_idx" ON "_pages_v_blocks_contact_details" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_details_parent_id_idx" ON "_pages_v_blocks_contact_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_service_index_groups_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_index_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_index" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_index_groups_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_index_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_index" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_service_index_groups_services" CASCADE;
  DROP TABLE "pages_blocks_service_index_groups" CASCADE;
  DROP TABLE "pages_blocks_service_index" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_contact_details" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_service_index_groups_services" CASCADE;
  DROP TABLE "_pages_v_blocks_service_index_groups" CASCADE;
  DROP TABLE "_pages_v_blocks_service_index" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_details" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  ALTER TABLE "pages_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DEFAULT 'factory'::text;
  DROP TYPE "public"."enum_pages_blocks_industries_sectors_icon_name";
  CREATE TYPE "public"."enum_pages_blocks_industries_sectors_icon_name" AS ENUM('oil', 'water', 'beverage', 'pharma', 'power', 'factory', 'chemical', 'logistics');
  ALTER TABLE "pages_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DEFAULT 'factory'::"public"."enum_pages_blocks_industries_sectors_icon_name";
  ALTER TABLE "pages_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DATA TYPE "public"."enum_pages_blocks_industries_sectors_icon_name" USING "icon_name"::"public"."enum_pages_blocks_industries_sectors_icon_name";
  ALTER TABLE "_pages_v_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DEFAULT 'factory'::text;
  DROP TYPE "public"."enum__pages_v_blocks_industries_sectors_icon_name";
  CREATE TYPE "public"."enum__pages_v_blocks_industries_sectors_icon_name" AS ENUM('oil', 'water', 'beverage', 'pharma', 'power', 'factory', 'chemical', 'logistics');
  ALTER TABLE "_pages_v_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DEFAULT 'factory'::"public"."enum__pages_v_blocks_industries_sectors_icon_name";
  ALTER TABLE "_pages_v_blocks_industries_sectors" ALTER COLUMN "icon_name" SET DATA TYPE "public"."enum__pages_v_blocks_industries_sectors_icon_name" USING "icon_name"::"public"."enum__pages_v_blocks_industries_sectors_icon_name";
  ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "collapsible" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_rich_text" ALTER COLUMN "collapsible" DROP DEFAULT;
  ALTER TABLE "pages_blocks_feature_grid" DROP COLUMN "footnote";
  ALTER TABLE "pages_blocks_industries" DROP COLUMN "display";
  ALTER TABLE "_pages_v_blocks_feature_grid" DROP COLUMN "footnote";
  ALTER TABLE "_pages_v_blocks_industries" DROP COLUMN "display";
  DROP TYPE "public"."enum_pages_blocks_service_index_groups_services_link_type";
  DROP TYPE "public"."enum_pages_blocks_service_index_groups_icon_name";
  DROP TYPE "public"."enum_pages_blocks_industries_display";
  DROP TYPE "public"."enum_pages_blocks_stats_tone";
  DROP TYPE "public"."enum_pages_blocks_contact_details_icon_name";
  DROP TYPE "public"."enum__pages_v_blocks_service_index_groups_services_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_service_index_groups_icon_name";
  DROP TYPE "public"."enum__pages_v_blocks_industries_display";
  DROP TYPE "public"."enum__pages_v_blocks_stats_tone";
  DROP TYPE "public"."enum__pages_v_blocks_contact_details_icon_name";`)
}
