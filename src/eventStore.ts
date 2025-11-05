import { AccountEvent } from './events';

export class EventStore {
  private store = new Map<string, AccountEvent[]>();

  append(accountId: string, event: AccountEvent) {
    const list = this.store.get(accountId) ?? [];
    list.push(event);
    this.store.set(accountId, list);
  }

  load(accountId: string): AccountEvent[] {
    return [...(this.store.get(accountId) ?? [])];
  }

  clear() {
    this.store.clear();
  }
}
