import { v4 as uuidv4 } from 'uuid';

const KEY = 'guestId';
export function getOrCreateGuestId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(KEY, id);
  }
  return id;
}
