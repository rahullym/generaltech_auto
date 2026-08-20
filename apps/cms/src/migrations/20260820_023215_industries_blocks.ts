import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_industries_sectors_icon_name" AS ENUM('oil', 'water', 'beverage', 'pharma', 'power', 'factory', 'chemical', 'logistics');
  CREATE TYPE "public"."enum_pages_blocks_coverage_tone" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_industries_sectors_icon_name" AS ENUM('oil', 'water', 'beverage', 'pharma', 'power', 'factory', 'chemical', 'logistics');
  CREATE TYPE "public"."enum__pages_v_blocks_coverage_tone" AS ENUM('dark', 'light');
  CREATE TABLE "pages_blocks_industries_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_name" "enum_pages_blocks_industries_sectors_icon_name" DEFAULT 'factory',
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_industries" (
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
  
  CREATE TABLE "pages_blocks_coverage_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"tone" "enum_pages_blocks_coverage_tone" DEFAULT 'dark',
  	"note" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_why_us_proofs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_why_us_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_why_us" (
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
  
  CREATE TABLE "_pages_v_blocks_industries_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_name" "enum__pages_v_blocks_industries_sectors_icon_name" DEFAULT 'factory',
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_industries" (
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
  
  CREATE TABLE "_pages_v_blocks_coverage_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"tone" "enum__pages_v_blocks_coverage_tone" DEFAULT 'dark',
  	"note" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_us_proofs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_us_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_us" (
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
  
  ALTER TABLE "pages_blocks_industries_sectors" ADD CONSTRAINT "pages_blocks_industries_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_industries" ADD CONSTRAINT "pages_blocks_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coverage_areas" ADD CONSTRAINT "pages_blocks_coverage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coverage" ADD CONSTRAINT "pages_blocks_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_us_proofs" ADD CONSTRAINT "pages_blocks_why_us_proofs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_why_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_us_pillars" ADD CONSTRAINT "pages_blocks_why_us_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_why_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_us" ADD CONSTRAINT "pages_blocks_why_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industries_sectors" ADD CONSTRAINT "_pages_v_blocks_industries_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industries" ADD CONSTRAINT "_pages_v_blocks_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coverage_areas" ADD CONSTRAINT "_pages_v_blocks_coverage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coverage" ADD CONSTRAINT "_pages_v_blocks_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_us_proofs" ADD CONSTRAINT "_pages_v_blocks_why_us_proofs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_why_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_us_pillars" ADD CONSTRAINT "_pages_v_blocks_why_us_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_why_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_us" ADD CONSTRAINT "_pages_v_blocks_why_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_industries_sectors_order_idx" ON "pages_blocks_industries_sectors" USING btree ("_order");
  CREATE INDEX "pages_blocks_industries_sectors_parent_id_idx" ON "pages_blocks_industries_sectors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_industries_order_idx" ON "pages_blocks_industries" USING btree ("_order");
  CREATE INDEX "pages_blocks_industries_parent_id_idx" ON "pages_blocks_industries" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_industries_path_idx" ON "pages_blocks_industries" USING btree ("_path");
  CREATE INDEX "pages_blocks_coverage_areas_order_idx" ON "pages_blocks_coverage_areas" USING btree ("_order");
  CREATE INDEX "pages_blocks_coverage_areas_parent_id_idx" ON "pages_blocks_coverage_areas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_coverage_order_idx" ON "pages_blocks_coverage" USING btree ("_order");
  CREATE INDEX "pages_blocks_coverage_parent_id_idx" ON "pages_blocks_coverage" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_coverage_path_idx" ON "pages_blocks_coverage" USING btree ("_path");
  CREATE INDEX "pages_blocks_why_us_proofs_order_idx" ON "pages_blocks_why_us_proofs" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_us_proofs_parent_id_idx" ON "pages_blocks_why_us_proofs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_us_pillars_order_idx" ON "pages_blocks_why_us_pillars" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_us_pillars_parent_id_idx" ON "pages_blocks_why_us_pillars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_us_order_idx" ON "pages_blocks_why_us" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_us_parent_id_idx" ON "pages_blocks_why_us" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_us_path_idx" ON "pages_blocks_why_us" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_industries_sectors_order_idx" ON "_pages_v_blocks_industries_sectors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_industries_sectors_parent_id_idx" ON "_pages_v_blocks_industries_sectors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_industries_order_idx" ON "_pages_v_blocks_industries" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_industries_parent_id_idx" ON "_pages_v_blocks_industries" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_industries_path_idx" ON "_pages_v_blocks_industries" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_coverage_areas_order_idx" ON "_pages_v_blocks_coverage_areas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_coverage_areas_parent_id_idx" ON "_pages_v_blocks_coverage_areas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_coverage_order_idx" ON "_pages_v_blocks_coverage" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_coverage_parent_id_idx" ON "_pages_v_blocks_coverage" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_coverage_path_idx" ON "_pages_v_blocks_coverage" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_why_us_proofs_order_idx" ON "_pages_v_blocks_why_us_proofs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_us_proofs_parent_id_idx" ON "_pages_v_blocks_why_us_proofs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_us_pillars_order_idx" ON "_pages_v_blocks_why_us_pillars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_us_pillars_parent_id_idx" ON "_pages_v_blocks_why_us_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_us_order_idx" ON "_pages_v_blocks_why_us" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_us_parent_id_idx" ON "_pages_v_blocks_why_us" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_us_path_idx" ON "_pages_v_blocks_why_us" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_industries_sectors" CASCADE;
  DROP TABLE "pages_blocks_industries" CASCADE;
  DROP TABLE "pages_blocks_coverage_areas" CASCADE;
  DROP TABLE "pages_blocks_coverage" CASCADE;
  DROP TABLE "pages_blocks_why_us_proofs" CASCADE;
  DROP TABLE "pages_blocks_why_us_pillars" CASCADE;
  DROP TABLE "pages_blocks_why_us" CASCADE;
  DROP TABLE "_pages_v_blocks_industries_sectors" CASCADE;
  DROP TABLE "_pages_v_blocks_industries" CASCADE;
  DROP TABLE "_pages_v_blocks_coverage_areas" CASCADE;
  DROP TABLE "_pages_v_blocks_coverage" CASCADE;
  DROP TABLE "_pages_v_blocks_why_us_proofs" CASCADE;
  DROP TABLE "_pages_v_blocks_why_us_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_why_us" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_industries_sectors_icon_name";
  DROP TYPE "public"."enum_pages_blocks_coverage_tone";
  DROP TYPE "public"."enum__pages_v_blocks_industries_sectors_icon_name";
  DROP TYPE "public"."enum__pages_v_blocks_coverage_tone";`)
}
