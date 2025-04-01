export interface IExperienceRecord {
  status: string,
  estado: string,
  centro_custo: string,
  funcao: string,
  chapa: string,
  funcionario: string,
  admissao: string,
  primeiro_periodo: string,
  segundo_periodo: string,
  viajar: string,
  segmento: string,
}

export interface IExperienceResponse {
  success: boolean,
  message: string,
  records: IExperienceRecord[],
}
