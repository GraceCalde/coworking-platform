CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "reservas"
ALTER COLUMN "start_time"
TYPE TIMESTAMPTZ(3)
USING "start_time" AT TIME ZONE 'UTC';

ALTER TABLE "reservas"
ALTER COLUMN "end_time"
TYPE TIMESTAMPTZ(3)
USING "end_time" AT TIME ZONE 'UTC';
ALTER TABLE "reservas"
ADD CONSTRAINT "reservas_no_overlap"
EXCLUDE USING GIST (
    "id_espacio" WITH =,
    tstzrange("start_time", "end_time", '[)') WITH &&
)
WHERE ("estado" IN (1, 2));
