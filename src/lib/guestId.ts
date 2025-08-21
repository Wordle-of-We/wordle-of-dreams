import { v4 as uuidv4 } from 'uuid';

export function getOrCreateGuestId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('guestId');
  if (!id) {
    id = (globalThis.crypto?.randomUUID?.() ?? uuidv4());
    localStorage.setItem('guestId', id);
  }
  return id;
}
