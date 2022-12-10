import { connect, Connection } from "@planetscale/database";

export interface Env {
  KV_STORE: KVNamespace;
  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
}

interface TableRowResult {
  tableIsActive: boolean;
  baseIsActive: boolean;
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

const getSizeInBytes = (obj: any) => {
  let str = null;

  if (typeof obj === "string") {
    str = obj;
  } else {
    str = JSON.stringify(obj);
  }

  // Get the length of the Uint8Array
  return new TextEncoder().encode(str).length;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { url } = request;

    const details = request.cf as CfDetails;

    //
    // Parse request path
    //

    // Extract the baseId, tableId, and viewId from the path
    const path = new URL(url).pathname;
    const [_, baseId, tableId, viewId] = path.split("/");

    // Check that the baseId, tableId are valid
    if (!baseId || !tableId) {
      return new Response(
        "Request must contain the base id and table id, with an optional view id.",
        {
          status: 400,
        }
      );
    }

    // Check whether there is a page and pageSize query
    const page = new URL(url).searchParams.get("page") ?? "1";
    const pageSize = new URL(url).searchParams.get("pageSize") ?? "100";

    // If the pageSize is greater than 100, return a 400
    if (parseInt(pageSize) > 100) {
      return new Response("Page size cannot be greater than 100.", {
        status: 400,
      });
    }

    //
    // Validate the request, if the base has an API token
    //

    // Get the base and table details
    const detailsResult = await fetchAccessDetails(baseId, tableId, env);

    // If the result is a Response, return it
    if (detailsResult instanceof Response) {
      return detailsResult;
    }

    const { tableIsActive, baseIsActive, ttl, baseToken, apiToken } =
      detailsResult as TableRowResult;

    // Check that both the table and base are active
    if (!tableIsActive || !baseIsActive) {
      return new Response("Table or base is inactive.", {
        status: 404,
      });
    }

    // Check if the base has an API token, and if so, check if it's valid
    if (apiToken) {
      // Check that the request has the Authorization header
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return new Response("Authorization header is required.", {
          status: 401,
        });
      }

      // Check that the Authorization header is valid
      if (authHeader !== `Bearer ${apiToken}`) {
        return new Response("Authorization header is invalid.", {
          status: 401,
        });
      }
    }

    // TODO: Check whether the viewId is active

    //
    // Check whether data is in KV (key: data:baseId:tableId)
    //

    const conn = connect({
      host: env.DB_HOST,
      username: env.DB_USER,
      password: env.DB_PASS,
    });

    // TODO: Add page and pageSize to the cache key
    // TODO: Add the viewId to the cache key
    const cacheKey = `data:${baseId}:${tableId}`;
    let cachedValue = await env.KV_STORE.get(cacheKey);

    if (cachedValue) {
      // Save request
      await addRequestToDb(
        conn,
        details,
        baseId,
        tableId,
        getSizeInBytes(cachedValue)
      );

      // Return cached value
      return new Response(cachedValue, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    //
    // Fetch the data from Airtable
    //

    // TODO: Add page and pageSize to the request
    // TODO: Add the viewId to the request
    // Fetch the data
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}`,
      {
        headers: {
          Authorization: `Bearer ${baseToken}`,
        },
      }
    );
    const data = await response.json();

    // Store in the KV store
    await env.KV_STORE.put(cacheKey, JSON.stringify(data), {
      expirationTtl: ttl,
    });

    // Save request
    await addRequestToDb(conn, details, baseId, tableId, getSizeInBytes(data));

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

const fetchAccessDetails = async (
  baseId: string,
  tableId: string,
  env: Env
): Promise<TableRowResult | Response> => {
  // Check whether the details are in the cache
  const cachedRequestDetails = await env.KV_STORE.get(
    `request-details:${baseId}:${tableId}`
  );

  // If they are, return them
  if (cachedRequestDetails) {
    return JSON.parse(cachedRequestDetails);
  }

  const conn = connect({
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASS,
  });

  // If they aren't, fetch them from the database
  const requestDetails = await conn.execute(
    "SELECT t.active AS tableIsActive,b.active AS baseIsActive,k.token AS baseToken,b.apiToken,t.ttl FROM`Table` AS t LEFT JOIN Base AS b ON t.baseId=b.id LEFT JOIN Keys AS k ON b.keysEmail=k.email WHERE b.id=? AND t.id=?",
    [baseId, tableId]
  );

  // Check that the table and base exist
  if (requestDetails.rows.length === 0) {
    return new Response("Unable to find that table.", {
      status: 404,
    });
  }

  // Typecase the result to TableRowResult
  const results = requestDetails.rows[0] as TableRowResult;

  // Store them in the KV
  await env.KV_STORE.put(
    `request-details:${baseId}:${tableId}`,
    JSON.stringify(results),
    {
      expirationTtl: 60,
    }
  );

  return results;
};

const addRequestToDb = async (
  conn: Connection,
  details: CfDetails,
  baseId: string,
  tableId: string,
  requestSize: number
) => {
  await conn.execute(
    "INSERT INTO Request (createdAt, asn, continent, country, region, city, baseId, tableId, latitude, longitude, latlng, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
      requestSize,
    ]
  );
};
