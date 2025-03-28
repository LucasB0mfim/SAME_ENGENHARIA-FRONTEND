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
  criacao: string,
}

export interface IOrderListRequest {
  numero_oc: string;
  valor_total: number;
  pedidos: IOrderRecord[];
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  order: IOrderRecord[]
}

export interface IOrderItemUpdate {
  idprd: string;
  newQuantity: string;
}

export interface IManagerOrderRequest {
  numero_oc: string;
  date: Date;
  items: IOrderItemUpdate[];
}
