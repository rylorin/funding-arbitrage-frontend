import { io, Socket } from 'socket.io-client';
import type { WebSocketEvents } from '@/types/api';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

class WebSocketClient {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 5000;
  private isReconnecting = false;
  private shouldReconnect = true;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Don't create a new socket if one is already connecting/connected
        if (this.socket && (this.isConnected || this.isReconnecting)) {
          console.log('Socket already exists, skipping connection');
          resolve();
          return;
        }

        // Clean up existing socket if any
        if (this.socket) {
          this.socket.removeAllListeners();
          this.socket.disconnect();
        }

        this.socket = io(WS_URL, {
          transports: ['websocket'],
          upgrade: false,
          rememberUpgrade: false,
          timeout: 5000,
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.isReconnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this.isConnected = false;
          
          if (this.shouldReconnect && reason === 'io server disconnect') {
            // Server initiated disconnect, try to reconnect
            this.handleReconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.isConnected = false;
          
          if (this.reconnectAttempts === 0) {
            reject(new Error(`Failed to connect to WebSocket: ${error.message}`));
          } else if (this.shouldReconnect) {
            this.handleReconnect();
          }
        });

        // Handle authentication if needed
        this.socket.on('authenticate', () => {
          const token = localStorage.getItem('auth_token');
          if (token) {
            this.socket?.emit('auth', { token });
          } else {
            console.warn('WebSocket authentication requested but no token available');
            // In development mode, continue without auth for testing
            if (process.env.NODE_ENV === 'development') {
              console.log('Development mode: continuing without authentication');
            }
          }
        });

        // Handle authentication errors
        this.socket.on('auth_error', (error) => {
          console.error('WebSocket authentication failed:', error);
          this.isConnected = false;
          if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: authentication failed but continuing');
          }
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.isReconnecting = false;
    if (this.socket) {
      // Remove all event listeners before disconnecting
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached - giving up');
      this.shouldReconnect = false;
      return;
    }

    if (this.isReconnecting) {
      console.log('Reconnection already in progress');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;
    const delay = this.reconnectDelay;

    console.log(`Attempting to reconnect in ${delay}ms... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected && this.socket && this.shouldReconnect) {
        console.log('Executing reconnection attempt...');
        this.socket.connect();
      }
      this.isReconnecting = false;
    }, delay);
  }

  // Subscribe to funding rate updates
  onFundingRatesUpdate(callback: (data: WebSocketEvents['funding-rates-update']) => void): void {
    this.socket?.on('funding-rates-update', callback);
  }

  // Subscribe to opportunities updates
  onOpportunitiesUpdate(callback: (data: WebSocketEvents['opportunities-update']) => void): void {
    this.socket?.on('opportunities-update', callback);
  }

  // Subscribe to position updates
  onPositionPnLUpdate(callback: (data: WebSocketEvents['position-pnl-update']) => void): void {
    this.socket?.on('position-pnl-update', callback);
  }

  // Subscribe to position alerts
  onPositionAlert(callback: (data: WebSocketEvents['position-alert']) => void): void {
    this.socket?.on('position-alert', callback);
  }

  // Subscribe to position closed events
  onPositionClosed(callback: (data: WebSocketEvents['position-closed']) => void): void {
    this.socket?.on('position-closed', callback);
  }

  // Subscribe to exchange status updates
  onExchangeStatus(callback: (data: WebSocketEvents['exchange-status']) => void): void {
    this.socket?.on('exchange-status', callback);
  }

  // Generic event subscription
  on<T extends keyof WebSocketEvents>(event: T, callback: (data: WebSocketEvents[T]) => void): void {
    this.socket?.on(event, callback);
  }

  // Remove event listener
  off<T extends keyof WebSocketEvents>(event: T, callback?: (data: WebSocketEvents[T]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  // Emit events (for authentication, subscriptions, etc.)
  emit(event: string, data?: any): void {
    if (this.isConnected && this.socket && this.socket.connected) {
      try {
        this.socket.emit(event, data);
      } catch (error) {
        console.warn('Error emitting WebSocket event:', error);
      }
    } else {
      console.warn('Cannot emit event: WebSocket not connected');
    }
  }

  // Subscribe to specific data updates
  subscribeTo(subscriptions: string[]): void {
    this.emit('subscribe', subscriptions);
  }

  // Check connection status
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    return 'connecting';
  }
}

// Singleton instance
export const wsClient = new WebSocketClient();

// Hook for easier React integration
export const useWebSocket = () => {
  return {
    connect: () => wsClient.connect(),
    disconnect: () => wsClient.disconnect(),
    isConnected: () => wsClient.isSocketConnected(),
    getStatus: () => wsClient.getConnectionStatus(),
    on: wsClient.on.bind(wsClient),
    off: wsClient.off.bind(wsClient),
    emit: wsClient.emit.bind(wsClient),
    subscribeTo: wsClient.subscribeTo.bind(wsClient),
    
    // Specific subscriptions
    onFundingRatesUpdate: wsClient.onFundingRatesUpdate.bind(wsClient),
    onOpportunitiesUpdate: wsClient.onOpportunitiesUpdate.bind(wsClient),
    onPositionPnLUpdate: wsClient.onPositionPnLUpdate.bind(wsClient),
    onPositionAlert: wsClient.onPositionAlert.bind(wsClient),
    onPositionClosed: wsClient.onPositionClosed.bind(wsClient),
    onExchangeStatus: wsClient.onExchangeStatus.bind(wsClient),
  };
};