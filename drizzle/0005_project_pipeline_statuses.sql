ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'reviewed';
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'paid_out';
ALTER TYPE "project_status" ADD VALUE IF NOT EXISTS 'fulfilled';
