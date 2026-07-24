BEGIN;

WITH legacy_mapped AS (
  SELECT
    record."childId",
    CASE vaccine."name"
      WHEN 'BCG' THEN 'BCG-1'
      WHEN 'VPO 0' THEN 'VPO-0'
      WHEN 'VPO 1' THEN 'VPO-1'
      WHEN 'Pentavalent' THEN 'PENTA-1'
      WHEN 'DTC-HepB-Hib' THEN 'PENTA-1'
      WHEN 'DTC' THEN 'PENTA-1'
      WHEN 'Pneumocoque (PCV)' THEN 'PCV13-1'
      WHEN 'Rotavirus' THEN 'ROTA-1'
      WHEN 'Polio inactivé (VPI)' THEN 'VPI-1'
      WHEN 'RR (Rougeole-Rubéole)' THEN 'RR-1'
      WHEN 'Fièvre Jaune' THEN 'VAA-1'
      WHEN 'RR 2' THEN 'RR-2'
      WHEN 'Vitamine A' THEN 'VIT-A-1'
      ELSE NULL
    END AS target_code,
    COALESCE(record."completedAt", record."updatedAt") AS completed_at
  FROM "VaccinationRecord" AS record
  INNER JOIN "Vaccine" AS vaccine ON vaccine."id" = record."vaccineId"
  WHERE vaccine."code" IS NULL
    AND record."status" = 'DONE'
),
legacy_done AS (
  SELECT
    "childId",
    target_code,
    MAX(completed_at) AS completed_at
  FROM legacy_mapped
  WHERE target_code IS NOT NULL
  GROUP BY "childId", target_code
),
routine_schedule AS (
  SELECT *
  FROM "Vaccine"
  WHERE "recommendedAgeDays" IS NOT NULL
    AND "eligibilityRules"->>'schedule' = 'ROUTINE'
)
INSERT INTO "VaccinationRecord" (
  "id",
  "childId",
  "vaccineId",
  "status",
  "date",
  "completedAt",
  "version",
  "createdAt",
  "updatedAt"
)
SELECT
  md5('pev-2026:' || child."id" || ':' || vaccine."id"),
  child."id",
  vaccine."id",
  CASE WHEN legacy_done.target_code IS NOT NULL THEN 'DONE' ELSE 'PENDING' END,
  child."birthDate" + vaccine."recommendedAgeDays" * INTERVAL '1 day',
  legacy_done.completed_at,
  1,
  NOW(),
  NOW()
FROM "Child" AS child
CROSS JOIN routine_schedule AS vaccine
LEFT JOIN legacy_done
  ON legacy_done."childId" = child."id"
  AND legacy_done.target_code = vaccine."code"
ON CONFLICT ("childId", "vaccineId") DO UPDATE
SET
  "date" = EXCLUDED."date",
  "status" = CASE
    WHEN "VaccinationRecord"."status" = 'DONE' THEN 'DONE'
    ELSE EXCLUDED."status"
  END,
  "completedAt" = COALESCE(
    "VaccinationRecord"."completedAt",
    EXCLUDED."completedAt"
  ),
  "updatedAt" = NOW();

DELETE FROM "VaccinationRecord" AS record
USING "Vaccine" AS vaccine
WHERE vaccine."id" = record."vaccineId"
  AND vaccine."code" IS NULL;

COMMIT;
