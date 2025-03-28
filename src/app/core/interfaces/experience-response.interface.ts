export interface IExperienceRecord {
  STATUS: string,
  ESTADO: string,
  "CENTRO DE CUSTO": string,
  "FUNÇÃO": string,
  CHAPA: string,
  FUNCIONARIO: string,
  "DATA ADMISSÃO": Date,
  "PRIMEIRO PERIODO": Date,
  "SEGUNDO PERIODO": Date,
  "VIAJAR": string,
  SEGMENTO: string,
}

export interface IExperienceResponse {
  success: boolean,
  message: string,
  records: IExperienceRecord[],
}
