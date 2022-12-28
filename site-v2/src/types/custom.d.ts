export interface AirtableBase {
  id: string;
  name: string;
}

export interface AirtableView {
  id: string;
  name: string;
  type: string;
}

export interface AirtableTable {
  id: string;
  name: string;
  views: AirtableView[];
}

export interface TableApiResponse {
  tables: AirtableTable[];
}

export interface BaseApiResponse {
  bases: AirtableBase[];
}

export interface CfNamespace {
  name: string;
  expiration: number;
}

export interface CfListKeysResponse {
  success: boolean;
  errors: string[];
  messages: string[];
  result: CfNamespace[];
  result_info: {
    count: number;
    cursor: string;
  };
}
