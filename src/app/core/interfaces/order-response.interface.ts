export interface IOrderRecord {
  aprovador: string,
  data_aprovacao: Date,
  centro_custo: string,
  data_entrega: Date,
  numero_oc: string,
  quantidade: string,
  valor_total: string,
  idprd: string,
  descricao: string,
  tipo_mov: string,
  serie: string,
  nome_fornecedor: string,
  unidade: string,
  status: string,
  quantidade_entregue: string,
  nota_fiscal: string,
  ultima_atualizacao: string,
  recebedor: string,
}

export interface IGroupedRequest {
  total: number;
  numero_oc: string;
  items: IOrderRecord[];
}

export interface IRequestResponse {
  success: boolean;
  message: string;
  order: IOrderRecord[]
}
