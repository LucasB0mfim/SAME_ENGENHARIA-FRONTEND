export interface IRequestRecord {
  oc: number,
  fornecedor: string,
  data_criacao_oc: Date,
  centro_de_custo: string,
  data_entrega: Date,
  material: string,
  quantidade: number,
  usuario_criacao: string,
  unidade: string,
}

export interface IRequestResponse {
  success: boolean;
  message: string;
  request: IRequestRecord[]
}
