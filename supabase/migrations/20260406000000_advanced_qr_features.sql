-- Migration: Add advanced settings to qr_codes
-- This column allows the QR generator to store complex UI states like patterns, corner shapes, and error correction levels without needing multiple individual columns.

ALTER TABLE public.qr_codes ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;
