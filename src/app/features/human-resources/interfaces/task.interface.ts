export interface TaskParticipant {
  nome: string | null;
  funcao: string | null;
  valor: number;
  coligada: number;
  autorizacao: string | null;
}

export interface TaskCreator {
  nome: string;
  funcao: string;
  centro_custo: string;
}

export interface TaskItem {
  id: number;
  criador: TaskCreator;
  centro_custo: string | null;
  data_criacao: string | null;
  data_inicial: string | null;
  data_final: string | null;
  descricao: string | null;
  foto_prancheta: string | null;
  observacao: string | null;
  status: string;
  colaboradores: TaskParticipant[];
  tarefa_participantes: TaskParticipant[];
}

export interface TaskCountStatus {
  novo: number;
  andamento: number;
  concluido: number;
  cancelado: number;
}

export type MessageType = 'success' | 'error';
