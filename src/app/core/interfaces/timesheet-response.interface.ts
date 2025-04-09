export interface ITimesheetRecord {
  periodo: string;
  jornada_realizada: string;
  falta: string;
  evento_abono: string;
}

export interface ITimeSheetResponse {
  success: boolean;
  message: string;
  records: [];
}

export interface ICommonData {
  chapa: string,
  nome: string,
  records: ITimesheetRecord[];
}
