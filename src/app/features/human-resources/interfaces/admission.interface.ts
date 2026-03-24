export interface AdmissionItem {
  id: number;
  nome: string;
  funcao: string;
  cpf: string;
  rg: string;
  pis: string | null;
  numero_contato: string | null;
  numero_vem: string | null;
  endereco: string | null;
  data_admissao: string | null;
  data_nascimento: string | null;
  qtd_onibus: number | null;
  qtd_metro: number | null;
  criancas_dependentes: number | null;
  numero_calcado: string | null;
  tamanho_farda: string | null;
  foto_3x4: string | null;
  foto_cpf: string | null;
  foto_certidao: string | null;
  foto_comprovante_residencia: string | null;
  foto_rg_frente: string | null;
  foto_rg_verso: string | null;
  foto_vem: string | null;
  observacao: string | null;
  status: string;
}

export interface AdmissionCountStatus {
  novo: number;
  andamento: number;
  concluido: number;
  cancelado: number;
}

export type MessageType = 'success' | 'error';
