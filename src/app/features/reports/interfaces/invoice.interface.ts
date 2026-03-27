export interface InvoiceRawResponse {
  id: number;
  mes_medicao: string;
  data_vencimento: string;
  arquivo_url: string;
  status: string;
  observacao: string;
  created_at: string;
  updated_at: string;
  usuarios: {
    nome: string;
    funcao: string;
    centro_custo: string;
  };
}

export interface InvoiceCountStatus {
  pendente: number;
  pago: number;
  vencido: number;
  cancelado: number;
}

export type MessageType = 'success' | 'error';
