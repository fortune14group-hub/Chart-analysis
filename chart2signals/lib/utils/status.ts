export type StatusItem = {
  id: string;
  type: string;
  created?: number;
  handled: boolean;
  note?: string;
  receivedAt: number;
};

const MAX = 50;
const buf: StatusItem[] = [];

export function pushStatus(item: StatusItem) {
  buf.unshift(item);
  if (buf.length > MAX) buf.pop();
}

export function getRecent(limit = 10) {
  return buf.slice(0, limit);
}
