export interface ResignationItem {
  id: number;
  nome: string;
  funcao: string;
  centro_custo: string;
  modalidade: string;
  modalidade_aviso_trabalhado: string | null;
  colaborador_comunicado: string | null;
  data_solicitacao: string | null;
  data_comunicacao: string | null;
  data_inicio_aviso_trabalhado: string | null;
  data_ultimo_dia_trabalhado: string | null;
  data_demissao: string | null;
  data_rescisao: string | null;
  data_pagamento_rescisao: string | null;
  observacao: string | null;
  status: string;
}

export interface ResignationCountStatus {
  novo: number;
  andamento: number;
  aviso_trabalhado: number;
  demitido: number;
  desligado: number;
}

export type MessageType = 'success' | 'error';

export type GroupKey = 'reports' | 'hr';
