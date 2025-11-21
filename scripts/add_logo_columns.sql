-- Script SQL para agregar las columnas logo y nombre_logo a la tabla cooperativas
-- Ejecutar este script en PostgreSQL

ALTER TABLE cooperativas
ADD COLUMN IF NOT EXISTS logo BYTEA,
ADD COLUMN IF NOT EXISTS nombre_logo VARCHAR(255);

