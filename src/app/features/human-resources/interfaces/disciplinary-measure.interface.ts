export interface DisciplinaryMeasureItem {
  id: number;
  nome: string;
  funcao: string;
  centro_custo: string;
  criado_por: string;
  data_ocorrido: string | null;
  advertencia: string | null;
  motivo: string;
  observacao: string | null;
  status: string;
}

export interface DisciplinaryMeasureCountStatus {
  novo: number;
  andamento: number;
  concluido: number;
  cancelado: number;
}

export type MessageType = 'success' | 'error';
