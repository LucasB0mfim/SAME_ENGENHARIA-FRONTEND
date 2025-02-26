export interface ITimeSheetRecord {
  PERIODO: string;
  CHAPA: string | null;
  NOME: string;
  "JORNADA REALIZADA": string;
  FALTA: string;
  "EVENTO ABONO": string;
}

export interface ITimeSheetResponse {
  success: boolean;
  message: string;
  records: ITimeSheetRecord[];
}
