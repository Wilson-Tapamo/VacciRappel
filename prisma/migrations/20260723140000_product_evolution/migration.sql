-- Vaccination schedule precision and optimistic offline synchronization.
ALTER TABLE "Child" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "Vaccine"
  ADD COLUMN "code" TEXT,
  ADD COLUMN "seriesCode" TEXT,
  ADD COLUMN "doseNumber" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "recommendedAgeDays" INTEGER,
  ADD COLUMN "minIntervalDays" INTEGER,
  ADD COLUMN "eligibilityRules" JSONB,
  ADD COLUMN "route" TEXT,
  ALTER COLUMN "recommendedAge" SET DEFAULT 0;

ALTER TABLE "VaccinationRecord"
  ADD COLUMN "completedAt" TIMESTAMP(3),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

CREATE TABLE "FamilyAccess" (
  "id" TEXT NOT NULL,
  "childId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'CAREGIVER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FamilyAccess_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FamilyInvite" (
  "id" TEXT NOT NULL,
  "childId" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'CAREGIVER',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FamilyInvite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReminderPreference" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
  "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
  "reminderDaysBefore" INTEGER[] NOT NULL DEFAULT ARRAY[7, 2, 0]::INTEGER[],
  "quietHoursStart" TEXT DEFAULT '21:00',
  "quietHoursEnd" TEXT DEFAULT '07:00',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReminderPreference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PushSubscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "endpoint" TEXT NOT NULL,
  "p256dh" TEXT NOT NULL,
  "auth" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HealthFacility" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "phone" TEXT,
  "website" TEXT,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "openingHours" JSONB NOT NULL,
  "lastDeclaredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HealthFacility_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FacilityVaccineAvailability" (
  "id" TEXT NOT NULL,
  "facilityId" TEXT NOT NULL,
  "vaccineId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'UNKNOWN',
  "quantity" INTEGER,
  "note" TEXT,
  "declaredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FacilityVaccineAvailability_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VaccinationAppointment" (
  "id" TEXT NOT NULL,
  "childId" TEXT NOT NULL,
  "vaccineId" TEXT,
  "facilityId" TEXT,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PROPOSED',
  "confirmedAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VaccinationAppointment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReminderDelivery" (
  "id" TEXT NOT NULL,
  "appointmentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "sentAt" TIMESTAMP(3),
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReminderDelivery_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Child_userId_idx" ON "Child"("userId");
CREATE INDEX "GrowthRecord_childId_date_idx" ON "GrowthRecord"("childId", "date");
CREATE UNIQUE INDEX "Vaccine_code_key" ON "Vaccine"("code");
CREATE INDEX "Vaccine_seriesCode_doseNumber_idx" ON "Vaccine"("seriesCode", "doseNumber");
CREATE INDEX "Vaccine_recommendedAgeDays_idx" ON "Vaccine"("recommendedAgeDays");
CREATE INDEX "VaccinationRecord_childId_status_date_idx" ON "VaccinationRecord"("childId", "status", "date");
CREATE INDEX "VaccinationRecord_vaccineId_idx" ON "VaccinationRecord"("vaccineId");
CREATE UNIQUE INDEX "VaccinationRecord_childId_vaccineId_key" ON "VaccinationRecord"("childId", "vaccineId");
CREATE INDEX "FamilyAccess_userId_idx" ON "FamilyAccess"("userId");
CREATE UNIQUE INDEX "FamilyAccess_childId_userId_key" ON "FamilyAccess"("childId", "userId");
CREATE UNIQUE INDEX "FamilyInvite_tokenHash_key" ON "FamilyInvite"("tokenHash");
CREATE INDEX "FamilyInvite_childId_idx" ON "FamilyInvite"("childId");
CREATE INDEX "FamilyInvite_createdById_idx" ON "FamilyInvite"("createdById");
CREATE INDEX "FamilyInvite_expiresAt_idx" ON "FamilyInvite"("expiresAt");
CREATE UNIQUE INDEX "ReminderPreference_userId_key" ON "ReminderPreference"("userId");
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");
CREATE INDEX "HealthFacility_latitude_longitude_idx" ON "HealthFacility"("latitude", "longitude");
CREATE INDEX "FacilityVaccineAvailability_vaccineId_status_idx" ON "FacilityVaccineAvailability"("vaccineId", "status");
CREATE UNIQUE INDEX "FacilityVaccineAvailability_facilityId_vaccineId_key" ON "FacilityVaccineAvailability"("facilityId", "vaccineId");
CREATE INDEX "VaccinationAppointment_childId_status_scheduledFor_idx" ON "VaccinationAppointment"("childId", "status", "scheduledFor");
CREATE INDEX "VaccinationAppointment_facilityId_idx" ON "VaccinationAppointment"("facilityId");
CREATE INDEX "VaccinationAppointment_vaccineId_idx" ON "VaccinationAppointment"("vaccineId");
CREATE INDEX "ReminderDelivery_status_scheduledFor_idx" ON "ReminderDelivery"("status", "scheduledFor");
CREATE INDEX "ReminderDelivery_userId_idx" ON "ReminderDelivery"("userId");
CREATE UNIQUE INDEX "ReminderDelivery_appointmentId_userId_channel_scheduledFor_key" ON "ReminderDelivery"("appointmentId", "userId", "channel", "scheduledFor");

ALTER TABLE "Child" DROP CONSTRAINT "Child_userId_fkey";
ALTER TABLE "GrowthRecord" DROP CONSTRAINT "GrowthRecord_childId_fkey";
ALTER TABLE "VaccinationRecord" DROP CONSTRAINT "VaccinationRecord_childId_fkey";

ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GrowthRecord" ADD CONSTRAINT "GrowthRecord_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyAccess" ADD CONSTRAINT "FamilyAccess_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyAccess" ADD CONSTRAINT "FamilyAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyInvite" ADD CONSTRAINT "FamilyInvite_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyInvite" ADD CONSTRAINT "FamilyInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReminderPreference" ADD CONSTRAINT "ReminderPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FacilityVaccineAvailability" ADD CONSTRAINT "FacilityVaccineAvailability_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "HealthFacility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FacilityVaccineAvailability" ADD CONSTRAINT "FacilityVaccineAvailability_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VaccinationAppointment" ADD CONSTRAINT "VaccinationAppointment_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VaccinationAppointment" ADD CONSTRAINT "VaccinationAppointment_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VaccinationAppointment" ADD CONSTRAINT "VaccinationAppointment_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "HealthFacility"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReminderDelivery" ADD CONSTRAINT "ReminderDelivery_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "VaccinationAppointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReminderDelivery" ADD CONSTRAINT "ReminderDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
