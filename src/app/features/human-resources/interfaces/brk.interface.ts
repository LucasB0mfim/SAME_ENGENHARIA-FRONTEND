export interface BrkItem {
  id: number;
  nome: string;
  funcao: string;
  centro_custo: string;
  contrato: string | null;
  link: string | null;
  dt_envio_pesq_social: string | null;
  dt_prev_aprov_pesq_social: string | null;
  dt_envio_doc: string | null;
  dt_prev_aprov_doc: string | null;
  dt_reenvio_doc: string | null;
  dt_prev_aprov_reenvio_doc: string | null;
  aso: string | null;
  epi: string | null;
  treinamento: string | null;
  os: string | null;
  observacao: string | null;
  status: string;
}

export interface BrkCountStatus {
  novo: number;
  pesquisa_social: number;
  documentacao: number;
  integracao: number;
  liberado: number;
  pausado: number;
  cancelado: number;
}

export type MessageType = 'success' | 'error';
