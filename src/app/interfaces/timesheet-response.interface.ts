export interface ITimesheetRecord {
  PERIODO: string;
  CHAPA: string;
  NOME: string;
  'JORNADA REALIZADA': string;
  FALTA: string;
  'EVENTO ABONO': string;
}

export interface ITimeSheetResponse {
  success: boolean;
  message: string;
  records: ITimesheetRecord[];
}
