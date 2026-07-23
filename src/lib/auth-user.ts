import type { Session } from "next-auth";

export function getSessionUserId(session: Session | null) {
  return (session?.user as (Session["user"] & { id?: string }) | undefined)?.id;
}
