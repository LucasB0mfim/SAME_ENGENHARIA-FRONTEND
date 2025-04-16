export interface IItemRecord {
  idprd: string,
  data_criacao_oc: string,
  material: string,
  quantidade: string,
  unidade: string,
  valor_unitario: string,
  valor_total: string,
  status: string,
  data_entrega: string,
  previsao_entrega: string,
  nota_fiscal: string,
  registrado: string,
  quantidade_entregue: string
}

export interface ICommonData {
  data_criacao_oc: string,
  numero_oc: string,
  fornecedor: string,
  data_entrega: string,
  previsao_entrega: string,
  centro_custo: string,
  usuario_criacao: string,
  nota_fiscal: string,
  registrado: string,
  order: IItemRecord[]
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  order: []
}
