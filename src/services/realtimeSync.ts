import type { RealtimeSyncEvent, RealtimeEventType } from '../types';

type EventCallback<T = any> = (event: RealtimeSyncEvent<T>) => void;

class RealtimeSyncEngine {
  private channel: BroadcastChannel | null = null;
  private ws: WebSocket | null = null;
  private listeners: Map<RealtimeEventType | '*', Set<EventCallback>> = new Map();
  private wsUrl: string = 'ws://localhost:5001/ws';

  constructor() {
    this.initBroadcastChannel();
    this.initWebSocket();
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('reliefgrid_realtime_sync');
        this.channel.onmessage = (event: MessageEvent<RealtimeSyncEvent>) => {
          if (event.data && event.data.type) {
            this.dispatchToLocalListeners(event.data);
          }
        };
      } catch (err) {
        console.warn('[RealtimeSync] BroadcastChannel init error:', err);
      }
    }
  }

  private initWebSocket() {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;

    // Optional connection to live backend server if available
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('[RealtimeSync] Connected to ReliefGrid Real-time WebSocket Gateway');
      };

      this.ws.onmessage = (messageEvent) => {
        try {
          const syncEvent: RealtimeSyncEvent = JSON.parse(messageEvent.data);
          if (syncEvent && syncEvent.type) {
            this.dispatchToLocalListeners(syncEvent);
          }
        } catch (err) {
          console.error('[RealtimeSync] Failed to parse incoming WebSocket message', err);
        }
      };

      this.ws.onerror = () => {
        // In local in-browser mode, silently degrade to BroadcastChannel
      };

      this.ws.onclose = () => {
      };
    } catch {
      // Ignored
    }
  }

  private dispatchToLocalListeners(event: RealtimeSyncEvent) {
    // Exact match listeners
    const specificCallbacks = this.listeners.get(event.type);
    if (specificCallbacks) {
      specificCallbacks.forEach((cb) => {
        try {
          cb(event);
        } catch (e) {
          console.error(`[RealtimeSync] Error in listener for ${event.type}:`, e);
        }
      });
    }

    // Wildcard listeners
    const wildcardCallbacks = this.listeners.get('*');
    if (wildcardCallbacks) {
      wildcardCallbacks.forEach((cb) => {
        try {
          cb(event);
        } catch (e) {
          console.error('[RealtimeSync] Error in wildcard listener:', e);
        }
      });
    }
  }

  /**
   * Subscribe to specific real-time event types or '*' for all events
   */
  public subscribe<T = any>(type: RealtimeEventType | '*', callback: EventCallback<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  /**
   * Broadcast an event across all browser tabs, windows, and connected clients
   */
  public publish<T = any>(
    type: RealtimeEventType, 
    source: RealtimeSyncEvent['source'], 
    payload: T
  ): RealtimeSyncEvent<T> {
    const event: RealtimeSyncEvent<T> = {
      id: `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      type,
      source,
      timestamp: new Date().toISOString(),
      payload
    };

    // 1. Dispatch locally in current window
    this.dispatchToLocalListeners(event);

    // 2. Broadcast to other tabs via BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (err) {
        console.warn('[RealtimeSync] BroadcastChannel postMessage error:', err);
      }
    }

    // 3. Send to WebSocket server if connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(event));
      } catch (err) {
        console.warn('[RealtimeSync] WebSocket send error:', err);
      }
    }

    return event;
  }
}

// Global Singleton
export const realtimeSync = new RealtimeSyncEngine();
