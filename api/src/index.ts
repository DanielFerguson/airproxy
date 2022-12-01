import { connect, Connection } from "@planetscale/database";

export interface Env {
  KV_STORE: KVNamespace;
  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
  REQUEST_QUEUE: Queue;
}

interface TableRowResult {
  tableIsActive: boolean;
  baseIsActive: boolean;
  ttl: number;
  baseToken: string;
}

interface CfDetails {
  city: string;
  regionCode: string;
  country: string;
  continent: string;
  asn: number;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const { method, url } = request;

    const details = request.cf as CfDetails;

    //
    // Validate request method
    //

    if (method !== "GET") {
      return new Response(`Method '${method} is not allowed.'`, {
        status: 405,
      });
    }

    //
    // Parse request path
    //

    const conn = connect({
      host: env.DB_HOST,
      username: env.DB_USER,
      password: env.DB_PASS,
    });

    // /[tableId]/[baseId]/[?viewId]
    const path = new URL(url).pathname;
    const [_, baseId, tableId] = path.split("/");

    //
    // Check whether data is in KV (key: data:baseId:tableId)
    //

    const cacheKey = `data:${baseId}:${tableId}`;
    let cachedValue = await env.KV_STORE.get(cacheKey);

    if (cachedValue) {
      // Save request
      await addRequestToDb(conn, details, baseId, tableId);

      // Return cached value
      return new Response(cachedValue, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    //
    // Check whether the table and base are active, and get the ttl
    //

    const results = await conn.execute(
      "SELECT t.active as tableIsActive,b.active as baseIsActive,k.token as baseToken,t.ttl FROM `Table` as t LEFT JOIN Base as b ON t.baseId=b.id LEFT JOIN Keys as k on b.keysEmail = k.email WHERE b.id=? AND t.id=?",
      [baseId, tableId]
    );

    // Check that the table and base exist
    if (results.rows.length === 0) {
      return new Response("Unable to find that table.", {
        status: 404,
      });
    }

    const { tableIsActive, baseIsActive, ttl, baseToken } = results
      .rows[0] as TableRowResult;

    // Check that they are both active
    if (!tableIsActive || !baseIsActive) {
      return new Response("Table or base is inactive.", {
        status: 404,
      });
    }

    //
    // Fetch the data from Airtable
    //

    // TODO: Time queue vs. insert (q: do we need the queue? does it help?)

    console.log(baseToken);

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
    await addRequestToDb(conn, details, baseId, tableId);

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

const addRequestToDb = async (
  conn: Connection,
  details: CfDetails,
  baseId: string,
  tableId: string
) => {
  await conn.execute(
    "INSERT INTO Request (createdAt, asn, continent, country, region, city, baseId, tableId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      new Date().toISOString().slice(0, 19).replace("T", " "),
      details.asn,
      details.continent,
      details.country,
      details.regionCode,
      details.city,
      baseId,
      tableId,
    ]
  );
};
