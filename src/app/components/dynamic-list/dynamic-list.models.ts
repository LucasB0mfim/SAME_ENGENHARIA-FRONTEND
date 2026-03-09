export interface DynamicListConfig {
  statusButtons: { label: string; value: string }[];
  onStatusChange: (status: string) => void;
  cardHeader: {
    title: (item: any) => string;
    subtitles?: Array<(item: any) => string>;
  };
}
