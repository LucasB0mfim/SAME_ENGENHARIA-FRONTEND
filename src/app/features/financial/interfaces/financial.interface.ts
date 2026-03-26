export interface InvoiceItem {
  id: number;
  nome_completo: string;
  cnpj: string;
  data_periodo: string;
  data_vencimento: string;
  valor: number;
  linha_digitavel: string;
  pix_payload: string;
  arquivo_url: string;
  status: string;
  observacao: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceCountStatus {
  pendente: number;
  pago: number;
  vencido: number;
  cancelado: number;
}

export type MessageType = 'success' | 'error';
