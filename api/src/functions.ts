import { connect } from "@planetscale/database";
import type {
  CacheResponse,
  Env,
  Record,
  TableRowResult,
  AssetDetails,
} from "./types";

export const getAccessDetails = async (
  baseId: string,
  tableId: string,
  viewId: string | null,
  env: Env
): Promise<TableRowResult | Response> => {
  let cacheKey = `access:${baseId}:${tableId}`;

  if (viewId) cacheKey += `:${viewId}`;

  const response = await env.CACHE.get<CacheResponse>(cacheKey);

  if (response?.result) return JSON.parse(response.result);

  const dbConn = connect({
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASS,
  });

  let result = viewId
    ? await dbConn.execute(
        "SELECT t.active AS tableIsActive,b.active AS baseIsActive,b.active AS viewIsActive,k.token AS baseToken,b.apiToken,t.ttl FROM`Table` AS t LEFT JOIN Base AS b ON t.baseId=b.id LEFT JOIN PersonalAccessToken AS k ON b.userId=k.userId LEFT JOIN `View` AS v ON v.tableId=t.id WHERE b.id=? AND t.id=? AND v.id=?",
        [baseId, tableId, viewId]
      )
    : await dbConn.execute(
        "SELECT t.active AS tableIsActive,b.active AS baseIsActive,k.token AS baseToken,b.apiToken,t.ttl FROM`Table` AS t LEFT JOIN Base AS b ON t.baseId=b.id LEFT JOIN PersonalAccessToken AS k ON b.userId=k.userId WHERE b.id=? AND t.id=?",
        [baseId, tableId]
      );

  if (result.rows.length === 0) {
    return new Response("Unable to find that table.", {
      status: 404,
    });
  }

  const results = result.rows[0] as TableRowResult;

  await env.CACHE.put(cacheKey, JSON.stringify(results));

  return results;
};

export const isAssetRecord = (record: Record): boolean => {
  return (
    typeof record === "object" &&
    record.hasOwnProperty("id") &&
    record.hasOwnProperty("url") &&
    record.hasOwnProperty("type") &&
    record.hasOwnProperty("filename")
  );
};

export const getExtensionFromFilename = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const extractAssetUrls = (record: Record): AssetDetails[] => {
  let assets: AssetDetails[] = [];

  Object.keys(record.fields).forEach((key) => {
    const value: any = record.fields[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (isAssetRecord(item)) {
          assets.push({
            key: `${item.id}.${getExtensionFromFilename(item.filename)}`,
            url: item.url,
          });
        }
      });
    } else if (isAssetRecord(value)) {
      assets.push({
        key: `${value.id}.${getExtensionFromFilename(value.filename)}`,
        url: value.url,
      });
    }
  });

  return assets;
};
