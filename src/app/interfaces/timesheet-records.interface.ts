export interface ITimesheetRecord {
  PERIODO: string;
  CHAPA: number;
  NOME: string;
  'JORNADA REALIZADA': string;
  FALTA: string;
  'EVENTO ABONO': string;
}

export interface ITimesheetResponse {
  success: boolean;
  message: string;
  records: ITimesheetRecord[];
}
