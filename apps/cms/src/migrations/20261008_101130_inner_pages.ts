import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rich_text_footprint_rows_have_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_footprint_rows_add_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum_pages_blocks_diagram_nodes_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum_pages_blocks_diagram_groups_items_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum_pages_blocks_diagram_groups_tone" AS ENUM('accent', 'neutral');
  CREATE TYPE "public"."enum_pages_blocks_diagram_variant" AS ENUM('chain', 'groups');
  CREATE TYPE "public"."enum_pages_kind" AS ENUM('page', 'service', 'application');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_footprint_rows_have_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_footprint_rows_add_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum__pages_v_blocks_diagram_nodes_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum__pages_v_blocks_diagram_groups_items_icon" AS ENUM('gauge', 'meter', 'flow', 'valve', 'tank', 'transmitter', 'cabinet', 'cpu', 'logger', 'network', 'gateway', 'signal', 'cloud', 'phone', 'screen', 'dashboard', 'motor', 'pump', 'machine', 'robot', 'conveyor', 'sensor', 'thermometer', 'battery', 'shield', 'alert', 'wrench', 'cable', 'database', 'clipboard', 'pipe', 'building', 'cog');
  CREATE TYPE "public"."enum__pages_v_blocks_diagram_groups_tone" AS ENUM('accent', 'neutral');
  CREATE TYPE "public"."enum__pages_v_blocks_diagram_variant" AS ENUM('chain', 'groups');
  CREATE TYPE "public"."enum__pages_v_version_kind" AS ENUM('page', 'service', 'application');
  CREATE TYPE "public"."enum_header_nav_items_children_icon_name" AS ENUM('cpu', 'network', 'signal', 'cabinet', 'cog', 'refresh', 'shield', 'gauge', 'database', 'clipboard', 'chart', 'package', 'wrench', 'code', 'board', 'upgrade');
  CREATE TABLE "pages_blocks_rich_text_footprint_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"have" varchar,
  	"have_icon" "enum_pages_blocks_rich_text_footprint_rows_have_icon",
  	"add" varchar,
  	"add_icon" "enum_pages_blocks_rich_text_footprint_rows_add_icon",
  	"how" varchar
  );
  
  CREATE TABLE "pages_blocks_application_index" (
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
  
  CREATE TABLE "pages_blocks_diagram_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_diagram_nodes_icon",
  	"title" varchar,
  	"note" varchar,
  	"via" varchar
  );
  
  CREATE TABLE "pages_blocks_diagram_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_diagram_groups_items_icon",
  	"title" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_diagram_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"note" varchar,
  	"tone" "enum_pages_blocks_diagram_groups_tone"
  );
  
  CREATE TABLE "pages_blocks_diagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_diagram_variant" DEFAULT 'chain',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_schematic_key" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"sub" varchar,
  	"title" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_schematic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"title" varchar,
  	"drawing" jsonb,
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_service_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar
  );
  
  CREATE TABLE "pages_application_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_footprint_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"have" varchar,
  	"have_icon" "enum__pages_v_blocks_rich_text_footprint_rows_have_icon",
  	"add" varchar,
  	"add_icon" "enum__pages_v_blocks_rich_text_footprint_rows_add_icon",
  	"how" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_application_index" (
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
  
  CREATE TABLE "_pages_v_blocks_diagram_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_diagram_nodes_icon",
  	"title" varchar,
  	"note" varchar,
  	"via" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_diagram_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_diagram_groups_items_icon",
  	"title" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_diagram_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"note" varchar,
  	"tone" "enum__pages_v_blocks_diagram_groups_tone",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_diagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_diagram_variant" DEFAULT 'chain',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schematic_key" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"sub" varchar,
  	"title" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schematic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"title" varchar,
  	"drawing" jsonb,
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_service_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_application_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "footprint_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "kind" "enum_pages_kind" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN "service_order" numeric;
  ALTER TABLE "pages" ADD COLUMN "service_service_type" varchar;
  ALTER TABLE "pages" ADD COLUMN "application_order" numeric;
  ALTER TABLE "pages" ADD COLUMN "application_card_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "application_card_blurb" varchar;
  ALTER TABLE "pages" ADD COLUMN "application_card_image_id" integer;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "footprint_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_kind" "enum__pages_v_version_kind" DEFAULT 'page';
  ALTER TABLE "_pages_v" ADD COLUMN "version_service_order" numeric;
  ALTER TABLE "_pages_v" ADD COLUMN "version_service_service_type" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_application_order" numeric;
  ALTER TABLE "_pages_v" ADD COLUMN "version_application_card_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_application_card_blurb" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_application_card_image_id" integer;
  ALTER TABLE "header_nav_items_children" ADD COLUMN "icon_name" "enum_header_nav_items_children_icon_name";
  ALTER TABLE "header_nav_items_children" ADD COLUMN "group_name" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_enabled" boolean;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_eyebrow" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_view_all_label" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_promo_title" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_promo_body" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_strip_label" varchar;
  ALTER TABLE "pages_blocks_rich_text_footprint_rows" ADD CONSTRAINT "pages_blocks_rich_text_footprint_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_application_index" ADD CONSTRAINT "pages_blocks_application_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_diagram_nodes" ADD CONSTRAINT "pages_blocks_diagram_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_diagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_diagram_groups_items" ADD CONSTRAINT "pages_blocks_diagram_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_diagram_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_diagram_groups" ADD CONSTRAINT "pages_blocks_diagram_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_diagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_diagram" ADD CONSTRAINT "pages_blocks_diagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_schematic_key" ADD CONSTRAINT "pages_blocks_schematic_key_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_schematic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_schematic" ADD CONSTRAINT "pages_blocks_schematic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_service_aliases" ADD CONSTRAINT "pages_service_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_application_sectors" ADD CONSTRAINT "pages_application_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_footprint_rows" ADD CONSTRAINT "_pages_v_blocks_rich_text_footprint_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_application_index" ADD CONSTRAINT "_pages_v_blocks_application_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_diagram_nodes" ADD CONSTRAINT "_pages_v_blocks_diagram_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_diagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_diagram_groups_items" ADD CONSTRAINT "_pages_v_blocks_diagram_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_diagram_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_diagram_groups" ADD CONSTRAINT "_pages_v_blocks_diagram_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_diagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_diagram" ADD CONSTRAINT "_pages_v_blocks_diagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schematic_key" ADD CONSTRAINT "_pages_v_blocks_schematic_key_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_schematic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schematic" ADD CONSTRAINT "_pages_v_blocks_schematic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_service_aliases" ADD CONSTRAINT "_pages_v_version_service_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_application_sectors" ADD CONSTRAINT "_pages_v_version_application_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_footprint_rows_order_idx" ON "pages_blocks_rich_text_footprint_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_footprint_rows_parent_id_idx" ON "pages_blocks_rich_text_footprint_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_application_index_order_idx" ON "pages_blocks_application_index" USING btree ("_order");
  CREATE INDEX "pages_blocks_application_index_parent_id_idx" ON "pages_blocks_application_index" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_application_index_path_idx" ON "pages_blocks_application_index" USING btree ("_path");
  CREATE INDEX "pages_blocks_diagram_nodes_order_idx" ON "pages_blocks_diagram_nodes" USING btree ("_order");
  CREATE INDEX "pages_blocks_diagram_nodes_parent_id_idx" ON "pages_blocks_diagram_nodes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_diagram_groups_items_order_idx" ON "pages_blocks_diagram_groups_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_diagram_groups_items_parent_id_idx" ON "pages_blocks_diagram_groups_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_diagram_groups_order_idx" ON "pages_blocks_diagram_groups" USING btree ("_order");
  CREATE INDEX "pages_blocks_diagram_groups_parent_id_idx" ON "pages_blocks_diagram_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_diagram_order_idx" ON "pages_blocks_diagram" USING btree ("_order");
  CREATE INDEX "pages_blocks_diagram_parent_id_idx" ON "pages_blocks_diagram" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_diagram_path_idx" ON "pages_blocks_diagram" USING btree ("_path");
  CREATE INDEX "pages_blocks_schematic_key_order_idx" ON "pages_blocks_schematic_key" USING btree ("_order");
  CREATE INDEX "pages_blocks_schematic_key_parent_id_idx" ON "pages_blocks_schematic_key" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schematic_order_idx" ON "pages_blocks_schematic" USING btree ("_order");
  CREATE INDEX "pages_blocks_schematic_parent_id_idx" ON "pages_blocks_schematic" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schematic_path_idx" ON "pages_blocks_schematic" USING btree ("_path");
  CREATE INDEX "pages_service_aliases_order_idx" ON "pages_service_aliases" USING btree ("_order");
  CREATE INDEX "pages_service_aliases_parent_id_idx" ON "pages_service_aliases" USING btree ("_parent_id");
  CREATE INDEX "pages_application_sectors_order_idx" ON "pages_application_sectors" USING btree ("_order");
  CREATE INDEX "pages_application_sectors_parent_id_idx" ON "pages_application_sectors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_footprint_rows_order_idx" ON "_pages_v_blocks_rich_text_footprint_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_footprint_rows_parent_id_idx" ON "_pages_v_blocks_rich_text_footprint_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_application_index_order_idx" ON "_pages_v_blocks_application_index" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_application_index_parent_id_idx" ON "_pages_v_blocks_application_index" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_application_index_path_idx" ON "_pages_v_blocks_application_index" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_diagram_nodes_order_idx" ON "_pages_v_blocks_diagram_nodes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_diagram_nodes_parent_id_idx" ON "_pages_v_blocks_diagram_nodes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_diagram_groups_items_order_idx" ON "_pages_v_blocks_diagram_groups_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_diagram_groups_items_parent_id_idx" ON "_pages_v_blocks_diagram_groups_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_diagram_groups_order_idx" ON "_pages_v_blocks_diagram_groups" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_diagram_groups_parent_id_idx" ON "_pages_v_blocks_diagram_groups" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_diagram_order_idx" ON "_pages_v_blocks_diagram" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_diagram_parent_id_idx" ON "_pages_v_blocks_diagram" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_diagram_path_idx" ON "_pages_v_blocks_diagram" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_schematic_key_order_idx" ON "_pages_v_blocks_schematic_key" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schematic_key_parent_id_idx" ON "_pages_v_blocks_schematic_key" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schematic_order_idx" ON "_pages_v_blocks_schematic" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schematic_parent_id_idx" ON "_pages_v_blocks_schematic" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schematic_path_idx" ON "_pages_v_blocks_schematic" USING btree ("_path");
  CREATE INDEX "_pages_v_version_service_aliases_order_idx" ON "_pages_v_version_service_aliases" USING btree ("_order");
  CREATE INDEX "_pages_v_version_service_aliases_parent_id_idx" ON "_pages_v_version_service_aliases" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_application_sectors_order_idx" ON "_pages_v_version_application_sectors" USING btree ("_order");
  CREATE INDEX "_pages_v_version_application_sectors_parent_id_idx" ON "_pages_v_version_application_sectors" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_application_card_image_id_media_id_fk" FOREIGN KEY ("application_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_application_card_image_id_media_id_fk" FOREIGN KEY ("version_application_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_kind_idx" ON "pages" USING btree ("kind");
  CREATE INDEX "pages_application_application_card_image_idx" ON "pages" USING btree ("application_card_image_id");
  CREATE INDEX "_pages_v_version_version_kind_idx" ON "_pages_v" USING btree ("version_kind");
  CREATE INDEX "_pages_v_version_application_version_application_card_im_idx" ON "_pages_v" USING btree ("version_application_card_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_rich_text_footprint_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_application_index" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_diagram_nodes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_diagram_groups_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_diagram_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_diagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_schematic_key" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_schematic" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_service_aliases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_application_sectors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_footprint_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_application_index" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_diagram_nodes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_diagram_groups_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_diagram_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_diagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schematic_key" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schematic" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_service_aliases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_application_sectors" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_rich_text_footprint_rows" CASCADE;
  DROP TABLE "pages_blocks_application_index" CASCADE;
  DROP TABLE "pages_blocks_diagram_nodes" CASCADE;
  DROP TABLE "pages_blocks_diagram_groups_items" CASCADE;
  DROP TABLE "pages_blocks_diagram_groups" CASCADE;
  DROP TABLE "pages_blocks_diagram" CASCADE;
  DROP TABLE "pages_blocks_schematic_key" CASCADE;
  DROP TABLE "pages_blocks_schematic" CASCADE;
  DROP TABLE "pages_service_aliases" CASCADE;
  DROP TABLE "pages_application_sectors" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_footprint_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_application_index" CASCADE;
  DROP TABLE "_pages_v_blocks_diagram_nodes" CASCADE;
  DROP TABLE "_pages_v_blocks_diagram_groups_items" CASCADE;
  DROP TABLE "_pages_v_blocks_diagram_groups" CASCADE;
  DROP TABLE "_pages_v_blocks_diagram" CASCADE;
  DROP TABLE "_pages_v_blocks_schematic_key" CASCADE;
  DROP TABLE "_pages_v_blocks_schematic" CASCADE;
  DROP TABLE "_pages_v_version_service_aliases" CASCADE;
  DROP TABLE "_pages_v_version_application_sectors" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_application_card_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_application_card_image_id_media_id_fk";
  
  DROP INDEX "pages_kind_idx";
  DROP INDEX "pages_application_application_card_image_idx";
  DROP INDEX "_pages_v_version_version_kind_idx";
  DROP INDEX "_pages_v_version_application_version_application_card_im_idx";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "footprint_label";
  ALTER TABLE "pages" DROP COLUMN "kind";
  ALTER TABLE "pages" DROP COLUMN "service_order";
  ALTER TABLE "pages" DROP COLUMN "service_service_type";
  ALTER TABLE "pages" DROP COLUMN "application_order";
  ALTER TABLE "pages" DROP COLUMN "application_card_title";
  ALTER TABLE "pages" DROP COLUMN "application_card_blurb";
  ALTER TABLE "pages" DROP COLUMN "application_card_image_id";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "footprint_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_kind";
  ALTER TABLE "_pages_v" DROP COLUMN "version_service_order";
  ALTER TABLE "_pages_v" DROP COLUMN "version_service_service_type";
  ALTER TABLE "_pages_v" DROP COLUMN "version_application_order";
  ALTER TABLE "_pages_v" DROP COLUMN "version_application_card_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_application_card_blurb";
  ALTER TABLE "_pages_v" DROP COLUMN "version_application_card_image_id";
  ALTER TABLE "header_nav_items_children" DROP COLUMN "icon_name";
  ALTER TABLE "header_nav_items_children" DROP COLUMN "group_name";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_enabled";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_eyebrow";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_view_all_label";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_promo_title";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_promo_body";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_strip_label";
  DROP TYPE "public"."enum_pages_blocks_rich_text_footprint_rows_have_icon";
  DROP TYPE "public"."enum_pages_blocks_rich_text_footprint_rows_add_icon";
  DROP TYPE "public"."enum_pages_blocks_diagram_nodes_icon";
  DROP TYPE "public"."enum_pages_blocks_diagram_groups_items_icon";
  DROP TYPE "public"."enum_pages_blocks_diagram_groups_tone";
  DROP TYPE "public"."enum_pages_blocks_diagram_variant";
  DROP TYPE "public"."enum_pages_kind";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_footprint_rows_have_icon";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_footprint_rows_add_icon";
  DROP TYPE "public"."enum__pages_v_blocks_diagram_nodes_icon";
  DROP TYPE "public"."enum__pages_v_blocks_diagram_groups_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_diagram_groups_tone";
  DROP TYPE "public"."enum__pages_v_blocks_diagram_variant";
  DROP TYPE "public"."enum__pages_v_version_kind";
  DROP TYPE "public"."enum_header_nav_items_children_icon_name";`)
}
