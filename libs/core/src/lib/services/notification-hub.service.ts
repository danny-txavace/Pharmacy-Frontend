import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environment';

type EventCallback = (data: unknown) => void;

@Injectable({
  providedIn: 'root',
})
export class NotificationHubService implements OnDestroy {
  private connection!: signalR.HubConnection;
  private callbacks: Map<string, EventCallback[]> = new Map();
  private connectionPromise: Promise<void> | null = null; // Controla uma única tentativa de conexão

  constructor() {
    //this.buildConnection();
    //this.startConnection(); // Inicia uma vez no construtor
  }

  private buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.myGatewayApi}/hub/notifications`, {
        withCredentials: true,                    // Envia cookies (acc_tk)
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true                     // Só WebSocket (mais rápido e estável)
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Backoff exponencial suave: 0s, 2s, 5s, 10s, 20s...
          if (retryContext.previousRetryCount < 4) {
            return [0, 2000, 5000, 10000][retryContext.previousRetryCount];
          }
          return 20000; // máximo 20s entre tentativas
        }
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Re-registrar todos os listeners após reconexão automática
    this.connection.onreconnected(() => {
      //console.log('SignalR reconectado automaticamente');
      this.reRegisterCallbacks();
    });

    this.connection.onclose(() => {
      //console.warn('SignalR desconectado', error);
      this.connectionPromise = null; // Permite nova tentativa se necessário
    });
  }

  private async startConnection(): Promise<void> {
    // Garante que só tenta conectar uma vez por vez
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connectionPromise = this.connection.start()
      .then(() => {
        //console.log('SignalR conectado com sucesso');
        this.reRegisterCallbacks();
        this.connectionPromise = null;
      })
      .catch(() => {
        //console.error('Erro ao conectar SignalR:', err);
        this.connectionPromise = null;
        setTimeout(() => this.startConnection(), 5000);
      });

    return this.connectionPromise;
  }

  // Garante que a conexão está ativa antes de qualquer operação
  public async ensureConnected(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }
    await this.startConnection();
  }

  // Re-registra todos os callbacks no hub (útil após reconexão)
  private reRegisterCallbacks() {
    this.callbacks.forEach((_, eventName) => {
      // Remove listener antigo para evitar duplicação
      this.connection.off(eventName);
      // Re-adiciona
      this.connection.on(eventName, (data: unknown) => this.emitEvent(eventName, data));
    });
  }

  // Entrar em uma view/grupo
  public async joinView(viewName: string): Promise<void> {
    await this.ensureConnected();
    try {
      await this.connection.invoke('JoinView', viewName);
      //console.log(`Entrou na view: ${viewName}`);
    } catch (err) {
      console.error(`Erro ao entrar na view ${viewName}:`, err);
    }
  }

  // Sair de uma view/grupo
  public async leaveView(viewName: string): Promise<void> {
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }
    try {
      await this.connection.invoke('LeaveView', viewName);
      //console.log(`Saiu da view: ${viewName}`);
    } catch (err) {
      console.error(`Erro ao sair da view ${viewName}:`, err);
    }
  }

  // Registrar listener para um evento específico
  public on(eventName: string, callback: EventCallback): void {
    if (!this.callbacks.has(eventName)) {
      this.callbacks.set(eventName, []);

      // Registra no SignalR apenas uma vez por evento
      this.connection.on(eventName, (data: unknown) => {
        this.emitEvent(eventName, data);
      });
    }

    this.callbacks.get(eventName)?.push(callback);
  }

  // Remove um callback específico (opcional, para limpeza)
  public off(eventName: string, callback?: EventCallback): void {
    if (!this.callbacks.has(eventName)) return;

    const callbacks = this.callbacks.get(eventName);
    if (callbacks == undefined) return;

    if (callback) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }

    if (callbacks.length === 0) {
      this.connection.off(eventName);
      this.callbacks.delete(eventName);
    }
  }

  private emitEvent(eventName: string, data: unknown): void {
    this.callbacks.get(eventName)?.forEach(cb => cb(data));
  }

  // Desconectar manualmente (ex: logout)
  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.callbacks.clear();
      //console.log('SignalR desconectado manualmente');
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
