import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rich_text_layout" AS ENUM('default', 'editorial', 'split');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_media_aspect" AS ENUM('natural', 'wide', 'cinematic');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_features_icon_name" AS ENUM('cpu', 'dashboard', 'screen', 'network', 'signal', 'cabinet', 'cog', 'refresh', 'shield', 'gauge');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_display" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_logo_wall_layout" AS ENUM('grid', 'marquee');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('dark', 'light', 'compact');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_layout" AS ENUM('default', 'editorial', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_media_aspect" AS ENUM('natural', 'wide', 'cinematic');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_features_icon_name" AS ENUM('cpu', 'dashboard', 'screen', 'network', 'signal', 'cabinet', 'cog', 'refresh', 'shield', 'gauge');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_display" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_wall_layout" AS ENUM('grid', 'marquee');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('dark', 'light', 'compact');
  ALTER TYPE "public"."enum_pages_blocks_hero_variant" ADD VALUE 'banner' BEFORE 'centered';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_variant" ADD VALUE 'banner' BEFORE 'centered';
  CREATE TABLE "pages_blocks_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_hero_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_rich_text_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"meta" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps" (
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
  
  CREATE TABLE "pages_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum_pages_blocks_logo_wall_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"meta" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps" (
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
  
  CREATE TABLE "_pages_v_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum__pages_v_blocks_logo_wall_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "layout" "enum_pages_blocks_rich_text_layout" DEFAULT 'default';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "numbered" boolean;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "media_position" "enum_pages_blocks_rich_text_media_position" DEFAULT 'left';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "lede" boolean;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "collapsible" boolean;
  ALTER TABLE "pages_blocks_media" ADD COLUMN "aspect" "enum_pages_blocks_media_aspect" DEFAULT 'natural';
  ALTER TABLE "pages_blocks_media" ADD COLUMN "overline" varchar;
  ALTER TABLE "pages_blocks_feature_grid_features" ADD COLUMN "icon_name" "enum_pages_blocks_feature_grid_features_icon_name";
  ALTER TABLE "pages_blocks_feature_grid" ADD COLUMN "display" "enum_pages_blocks_feature_grid_display" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "variant" "enum_pages_blocks_cta_variant" DEFAULT 'dark';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "layout" "enum__pages_v_blocks_rich_text_layout" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "numbered" boolean;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "media_position" "enum__pages_v_blocks_rich_text_media_position" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "lede" boolean;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "collapsible" boolean;
  ALTER TABLE "_pages_v_blocks_media" ADD COLUMN "aspect" "enum__pages_v_blocks_media_aspect" DEFAULT 'natural';
  ALTER TABLE "_pages_v_blocks_media" ADD COLUMN "overline" varchar;
  ALTER TABLE "_pages_v_blocks_feature_grid_features" ADD COLUMN "icon_name" "enum__pages_v_blocks_feature_grid_features_icon_name";
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD COLUMN "display" "enum__pages_v_blocks_feature_grid_display" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'dark';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "intro" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "logo_inverse_id" integer;
  ALTER TABLE "pages_blocks_hero_images" ADD CONSTRAINT "pages_blocks_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_images" ADD CONSTRAINT "pages_blocks_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_marquee_logos" ADD CONSTRAINT "pages_blocks_hero_marquee_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_marquee_logos" ADD CONSTRAINT "pages_blocks_hero_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_media" ADD CONSTRAINT "pages_blocks_rich_text_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_media" ADD CONSTRAINT "pages_blocks_rich_text_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_steps" ADD CONSTRAINT "pages_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps" ADD CONSTRAINT "pages_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall_logos" ADD CONSTRAINT "pages_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall_logos" ADD CONSTRAINT "pages_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall" ADD CONSTRAINT "pages_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_images" ADD CONSTRAINT "_pages_v_blocks_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_images" ADD CONSTRAINT "_pages_v_blocks_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_hero_marquee_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_hero_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_media" ADD CONSTRAINT "_pages_v_blocks_rich_text_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_media" ADD CONSTRAINT "_pages_v_blocks_rich_text_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" ADD CONSTRAINT "_pages_v_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" ADD CONSTRAINT "_pages_v_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall" ADD CONSTRAINT "_pages_v_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_images_order_idx" ON "pages_blocks_hero_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_images_parent_id_idx" ON "pages_blocks_hero_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_images_image_idx" ON "pages_blocks_hero_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_marquee_logos_order_idx" ON "pages_blocks_hero_marquee_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_marquee_logos_parent_id_idx" ON "pages_blocks_hero_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_marquee_logos_image_idx" ON "pages_blocks_hero_marquee_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_rich_text_media_order_idx" ON "pages_blocks_rich_text_media" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_media_parent_id_idx" ON "pages_blocks_rich_text_media" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_media_image_idx" ON "pages_blocks_rich_text_media" USING btree ("image_id");
  CREATE INDEX "pages_blocks_process_steps_steps_order_idx" ON "pages_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_steps_parent_id_idx" ON "pages_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_order_idx" ON "pages_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_parent_id_idx" ON "pages_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_path_idx" ON "pages_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_wall_logos_order_idx" ON "pages_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_logos_parent_id_idx" ON "pages_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_logos_image_idx" ON "pages_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_wall_order_idx" ON "pages_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_parent_id_idx" ON "pages_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_path_idx" ON "pages_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_images_order_idx" ON "_pages_v_blocks_hero_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_images_parent_id_idx" ON "_pages_v_blocks_hero_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_images_image_idx" ON "_pages_v_blocks_hero_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_marquee_logos_order_idx" ON "_pages_v_blocks_hero_marquee_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_marquee_logos_parent_id_idx" ON "_pages_v_blocks_hero_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_marquee_logos_image_idx" ON "_pages_v_blocks_hero_marquee_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_rich_text_media_order_idx" ON "_pages_v_blocks_rich_text_media" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_media_parent_id_idx" ON "_pages_v_blocks_rich_text_media" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_media_image_idx" ON "_pages_v_blocks_rich_text_media" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_order_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_parent_id_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_order_idx" ON "_pages_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_parent_id_idx" ON "_pages_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_path_idx" ON "_pages_v_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_order_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_parent_id_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_image_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_order_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_wall_parent_id_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_path_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_path");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_inverse_id_media_id_fk" FOREIGN KEY ("logo_inverse_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_inverse_idx" ON "site_settings" USING btree ("logo_inverse_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_marquee_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_wall_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_wall" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_marquee_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_wall" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_images" CASCADE;
  DROP TABLE "pages_blocks_hero_marquee_logos" CASCADE;
  DROP TABLE "pages_blocks_rich_text_media" CASCADE;
  DROP TABLE "pages_blocks_process_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps" CASCADE;
  DROP TABLE "pages_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_wall" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_images" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_marquee_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_media" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_inverse_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'centered'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('centered', 'split', 'minimal');
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'centered'::"public"."enum_pages_blocks_hero_variant";
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_hero_variant" USING "variant"::"public"."enum_pages_blocks_hero_variant";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'centered'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('centered', 'split', 'minimal');
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'centered'::"public"."enum__pages_v_blocks_hero_variant";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_hero_variant" USING "variant"::"public"."enum__pages_v_blocks_hero_variant";
  DROP INDEX "site_settings_logo_inverse_idx";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "numbered";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "media_position";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "lede";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "collapsible";
  ALTER TABLE "pages_blocks_media" DROP COLUMN "aspect";
  ALTER TABLE "pages_blocks_media" DROP COLUMN "overline";
  ALTER TABLE "pages_blocks_feature_grid_features" DROP COLUMN "icon_name";
  ALTER TABLE "pages_blocks_feature_grid" DROP COLUMN "display";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "numbered";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "media_position";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "lede";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "collapsible";
  ALTER TABLE "_pages_v_blocks_media" DROP COLUMN "aspect";
  ALTER TABLE "_pages_v_blocks_media" DROP COLUMN "overline";
  ALTER TABLE "_pages_v_blocks_feature_grid_features" DROP COLUMN "icon_name";
  ALTER TABLE "_pages_v_blocks_feature_grid" DROP COLUMN "display";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "intro";
  ALTER TABLE "site_settings" DROP COLUMN "logo_inverse_id";
  DROP TYPE "public"."enum_pages_blocks_rich_text_layout";
  DROP TYPE "public"."enum_pages_blocks_rich_text_media_position";
  DROP TYPE "public"."enum_pages_blocks_media_aspect";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_features_icon_name";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_display";
  DROP TYPE "public"."enum_pages_blocks_logo_wall_layout";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_layout";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_media_position";
  DROP TYPE "public"."enum__pages_v_blocks_media_aspect";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_features_icon_name";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_display";
  DROP TYPE "public"."enum__pages_v_blocks_logo_wall_layout";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";`)
}
