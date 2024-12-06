interface WakeLockSentinel extends EventTarget {
  released: boolean;
  type: "screen";
  release(): Promise<void>;
}

interface WakeLock {
  request(type: "screen"): Promise<WakeLockSentinel>;
}

export interface WakeLockSentinel {
  readonly released: boolean;
  readonly type: "screen";
  release(): Promise<void>;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

declare global {
  interface Navigator {
    readonly wakeLock: {
      request(type: "screen"): Promise<WakeLockSentinel>;
    };
  }
}

export {};
