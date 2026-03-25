export interface TransportItem {
  id: number;
  nome: string;
  funcao: string;
  centro_custo: string;
  tipo: string;
  motivo: string | null;
  endereco: string | null;
  qtd_onibus: number | null;
  qtd_metro: number | null;
  data_criacao: string | null;
  observacao: string | null;
  status: string;
}

export interface TransportCountStatus {
  novo: number;
  andamento: number;
  concluido: number;
  cancelado: number;
}

export type MessageType = 'success' | 'error';
