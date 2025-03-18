export interface ITrackingRecord {
  "COTACAO": string,
  "INTEGRACAO": string,
  "CENTRO_CUSTO": string,
  "MOVIMENTO": string,
  "ID": string,
  "ELABORACAO_PEDIDO": Date,
  "APROVACAO_ID": Date,
  "NUMERO_OC": string,
  "ELABORACAO_OC": Date,
  "APROVACAO_OC": Date,
  "DATA_ENTREGA": Date,
  "FORNECEDOR": string
  "MATERIAL": string,
  "QUANTIDADE_TOTAL": string,
  "UNIDADE": string,
  "STATUS": string,
}

export interface ITrackingResponse {
  success: boolean;
  message: string;
  tracking: ITrackingRecord[]
}
