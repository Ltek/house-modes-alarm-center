// Modified from alarmo-card (github.com/nielsfaber/alarmo-card, Apache License 2.0, see card/LICENSE-alarmo-card) for House Modes & Alarm Center.
export function computeEntity(entityId: string): string {
  return entityId.substring(entityId.indexOf(".") + 1);
}