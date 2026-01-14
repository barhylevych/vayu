DO $$ BEGIN
 CREATE TYPE "group_status" AS ENUM('Empty', 'NotEmpty');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "group_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_groups" (
	"user_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	CONSTRAINT "user_groups_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');--> statement-breakpoint
INSERT INTO users (name, email) VALUES ('Jane Smith', 'jane@example.com');--> statement-breakpoint

-- Insert initial data into groups table
INSERT INTO groups (name, status) VALUES ('Admins', 'NotEmpty');--> statement-breakpoint
INSERT INTO groups (name, status) VALUES ('Users', 'NotEmpty');--> statement-breakpoint

-- Insert initial data into user_groups table
INSERT INTO user_groups (user_id, group_id) VALUES (1, 1);--> statement-breakpoint
INSERT INTO user_groups (user_id, group_id) VALUES (2, 2);--> statement-breakpoint
