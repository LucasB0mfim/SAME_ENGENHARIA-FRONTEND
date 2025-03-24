export interface IRequestRecord {
  oc: string,
  fornecedor: string,
  data_criacao_oc: Date,
  centro_de_custo: string,
  data_entrega: Date,
  material: string,
  quantidade: string,
  usuario_criacao: string,
  unidade: string,
  status: string,
  quantidade_entregue: string,
  urgencia: string,
  nota_fiscal: string,
  valor: string
}

export interface IRequestResponse {
  success: boolean;
  message: string;
  order: IRequestRecord[]
}
