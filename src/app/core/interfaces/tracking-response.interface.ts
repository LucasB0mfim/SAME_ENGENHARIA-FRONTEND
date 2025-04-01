export interface ITrackingRecord {
  cotacao: string,
  integracao: string,
  centro_custo: string,
  movimento: string,
  id: string,
  elaboracao_pedido: string,
  aprovacao_id: string,
  numero_oc: string,
  elaboracao_oc: string,
  aprovacao_oc: string,
  data_entrega: string,
  fornecedor: string,
  material: string,
  quantidade_total: string,
  unidade: string,
  status: string,
  criacao: string
}

export interface ITrackingResponse {
  success: boolean;
  message: string;
  tracking: ITrackingRecord[]
}
