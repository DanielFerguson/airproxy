import { connect, Connection } from "@planetscale/database";
import { Redis } from "@upstash/redis/cloudflare";

export interface Env {
  KV_STORE: KVNamespace;
  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

interface TableRowResult {
  tableIsActive: boolean;
  baseIsActive: boolean;
  viewIsActive?: boolean;
  ttl: number;
  baseToken: string;
  apiToken?: string;
}

interface CfDetails {
  city: string;
  regionCode: string;
  country: string;
  continent: string;
  asn: number;
  latitude: string;
  longitude: string;
}

interface CacheResponse {
  result: string | null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    //
    // Parse request path
    //

    const details = request.cf as CfDetails;
    const path = new URL(request.url).pathname;
    const [_, baseId, tableId, viewId] = path.split("/");

    if (!baseId || !tableId) {
      return new Response(
        "Request must contain the base id and table id, with an optional view id.",
        {
          status: 400,
        }
      );
    }

    const page = new URL(request.url).searchParams.get("page") ?? "1";
    const pageSize = new URL(request.url).searchParams.get("pageSize") ?? "100";

    console.log(env.DB_USER);

    if (parseInt(pageSize) > 100) {
      return new Response("Page size cannot be greater than 100.", {
        status: 400,
      });
    }

    //
    // Validate the request, if the base has an API token
    //

    const redis = Redis.fromEnv(env);

    const dbConn = connect({
      host: env.DB_HOST,
      username: env.DB_USER,
      password: env.DB_PASS,
    });

    const [, accessDetails] = await Promise.all([
      saveRequest(dbConn, details, baseId, tableId),
      getAccessDetails(baseId, tableId, viewId, redis, dbConn),
    ]);

    if (accessDetails instanceof Response) {
      return accessDetails;
    }

    const {
      tableIsActive,
      baseIsActive,
      viewIsActive,
      ttl,
      baseToken,
      apiToken,
    } = accessDetails as TableRowResult;

    if (!tableIsActive || !baseIsActive || viewIsActive === false) {
      return new Response("Table, base, or view is inactive.", {
        status: 404,
      });
    }

    if (apiToken) {
      const authHeader = request.headers.get("Authorization");

      if (!authHeader) {
        return new Response("Authorization header is required.", {
          status: 401,
        });
      }

      if (authHeader !== `Bearer ${apiToken}`) {
        return new Response("Authorization header is invalid.", {
          status: 401,
        });
      }
    }

    //
    // Check whether data is in the cache
    //

    let cacheKey = `data:${baseId}:${tableId}`;

    if (viewId) cacheKey += `:${viewId}`;
    if (page) cacheKey += `:page-${page}`;
    if (pageSize) cacheKey += `:pageSize-${pageSize}`;

    let cachedValue = await redis.get(cacheKey);

    if (cachedValue) {
      return new Response(JSON.stringify(cachedValue), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    //
    // Fetch the data from Airtable
    //

    let url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);

    if (viewId) url.searchParams.set("view", viewId);
    if (page) url.searchParams.set("page", page);
    if (pageSize) url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${baseToken}`,
      },
    });

    const data = await response.json();

    await Promise.all([
      redis.set(cacheKey, data, { ex: ttl }),
      saveRequest(dbConn, details, baseId, tableId),
    ]);

    //
    // Return the data
    //

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

const getAccessDetails = async (
  baseId: string,
  tableId: string,
  viewId: string | null,
  redis: Redis,
  dbConn: Connection
): Promise<TableRowResult | Response> => {
  let cacheKey = `access:${baseId}:${tableId}`;

  if (viewId) {
    cacheKey += `:${viewId}`;
  }

  const response = await redis.get<CacheResponse>(cacheKey);

  if (response?.result) {
    return JSON.parse(response.result);
  }

  let result = viewId
    ? await dbConn.execute(
        "SELECT t.active AS tableIsActive,b.active AS baseIsActive,b.active AS viewIsActive,k.token AS baseToken,b.apiToken,t.ttl FROM`Table` AS t LEFT JOIN Base AS b ON t.baseId=b.id LEFT JOIN Keys AS k ON b.keysEmail=k.email LEFT JOIN View AS v ON v.tableId=t.id WHERE b.id=? AND t.id=? AND v.id=?",
        [baseId, tableId, viewId]
      )
    : await dbConn.execute(
        "SELECT t.active AS tableIsActive,b.active AS baseIsActive,k.token AS baseToken,b.apiToken,t.ttl FROM`Table` AS t LEFT JOIN Base AS b ON t.baseId=b.id LEFT JOIN Keys AS k ON b.keysEmail=k.email WHERE b.id=? AND t.id=?",
        [baseId, tableId]
      );

  if (result.rows.length === 0) {
    return new Response("Unable to find that table.", {
      status: 404,
    });
  }

  const results = result.rows[0] as TableRowResult;

  await redis.set(cacheKey, JSON.stringify(results));

  return results;
};

const saveRequest = (
  dbConn: Connection,
  details: CfDetails,
  baseId: string,
  tableId: string
) => {
  return dbConn.execute(
    "INSERT INTO Request (createdAt, asn, continent, country, region, city, baseId, tableId, latitude, longitude, latlng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      new Date().toISOString().slice(0, 19).replace("T", " "),
      details.asn,
      details.continent,
      details.country,
      details.regionCode,
      details.city,
      baseId,
      tableId,
      parseFloat(details.latitude),
      parseFloat(details.longitude),
      `${details.latitude}, ${details.longitude}`,
    ]
  );
};
