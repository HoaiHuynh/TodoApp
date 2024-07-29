CREATE TABLE `labels` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`color` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `priorities` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`color` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`completed` integer,
	`priority` integer,
	`label` text,
	`schedule` text,
	`created_at` text NOT NULL,
	`updated_at` text
);
