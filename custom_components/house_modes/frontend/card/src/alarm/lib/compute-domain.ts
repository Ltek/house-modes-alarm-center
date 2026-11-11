// Modified from alarmo-card (github.com/nielsfaber/alarmo-card, Apache License 2.0, see card/LICENSE-alarmo-card) for House Modes & Alarm Center.
export function computeDomain(entityId: string): string {
  return entityId.substring(0, entityId.indexOf("."));
}