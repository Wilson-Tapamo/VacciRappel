import { prisma } from "@/lib/prisma";

export async function getChildAccess(userId: string, childId: string) {
  const child = await prisma.child.findUnique({
    where: { id: childId },
    include: {
      familyAccess: {
        where: { userId },
        select: { role: true },
      },
    },
  });

  if (!child) return null;
  if (child.userId === userId) return { childId, role: "OWNER", canEdit: true, child };

  const access = child.familyAccess[0];
  if (!access) return null;
  return {
    childId,
    role: access.role,
    canEdit: access.role !== "VIEWER",
    child,
  };
}
