export interface CfDetails {
  city: string;
  regionCode: string;
  country: string;
  continent: string;
  asn: number;
  latitude: string;
  longitude: string;
}

export interface TableRowResult {
  tableIsActive: boolean;
  baseIsActive: boolean;
  viewIsActive?: boolean;
  ttl: number;
  baseToken: string;
  apiToken?: string;
}

export interface CacheResponse {
  result: string | null;
}

type QueueMessageTypes = "download-image" | "save-request";

export interface QueueMessage {
  action: QueueMessageTypes;
  data: RequestDetails | AssetDetails;
}

export interface RecordGroup {
  records: Record[];
  offset?: string;
}

export interface Record {
  id: string;
  createdTime: string;
  fields: RecordFields;
}

export interface RecordFields {
  [key: string]: string | number | string[] | number[] | Object;
}

export interface RequestDetails {
  createdAt: string;
  asn: number;
  continent: string;
  country: string;
  region: string;
  city: string;
  baseId: string;
  tableId: string;
  latitude: number;
  longitude: number;
  latlng: string;
}

export interface AssetDetails {
  key: string;
  url: string;
}

export type MessageSendRequest<Body = any> = {
  body: Body;
};

interface Queue<Body = any> {
  send(body: Body): Promise<void>;
  sendBatch(messages: Iterable<MessageSendRequest<Body>>): Promise<void>;
}

export interface Env {
  CACHE: KVNamespace;
  BUCKET: R2Bucket;
  QUEUE: Queue;
  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
}
