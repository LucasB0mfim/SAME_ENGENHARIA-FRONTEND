export interface IExperienceRecord {
  STATUS: string,
  ESTADO: string,
  "CENTRO DE CUSTO": string,
  "FUNÇÃO": string,
  CHAPA: number,
  FUNCIONARIO: string,
  "DATA ADMISSÃO": Date,
  "PRIMEIRO PERIODO": Date,
  "SEGUNDO PERIODO": Date,
}

export interface IExperienceResponse {
  success: boolean,
  message: string,
  records: IExperienceRecord[],
}
