import { connect } from "@planetscale/database";
import { extractAssetUrls, getAccessDetails } from "./functions";
import type {
  CfDetails,
  Env,
  AssetDetails,
  QueueMessage,
  RecordGroup,
  RequestDetails,
  TableRowResult,
  MessageSendRequest,
} from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    //
    // Parse request path
    //

    const { asn, continent, country, regionCode, city, latitude, longitude } =
      request.cf as CfDetails;

    const path = new URL(request.url).pathname;
    const [_, baseId, tableId, viewId] = path.split("/");

    const pageViewRequest = env.QUEUE.send({
      action: "save-request",
      data: {
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        asn: asn,
        continent: continent,
        country: country,
        region: regionCode,
        city: city,
        baseId: baseId,
        tableId: tableId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latlng: `${latitude}, ${longitude}`,
      },
    });

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

    if (parseInt(pageSize) > 100) {
      return new Response("Page size cannot be greater than 100.", {
        status: 400,
      });
    }

    //
    // Validate the request, if the base has an API token
    //

    const accessDetailsResponse = await getAccessDetails(
      baseId,
      tableId,
      viewId,
      env
    );

    if (accessDetailsResponse instanceof Response) {
      return accessDetailsResponse;
    }

    const {
      tableIsActive,
      baseIsActive,
      viewIsActive,
      ttl,
      baseToken,
      apiToken,
    } = accessDetailsResponse as TableRowResult;

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

      if (authHeader && authHeader !== `Bearer ${apiToken}`) {
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

    const cachedValue = await env.CACHE.get(cacheKey);

    if (cachedValue) {
      // Make sure the page view request is sent to the queue
      await pageViewRequest;

      return new Response(cachedValue, {
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

    const data: RecordGroup = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${baseToken}`,
      },
    }).then((res) => res.json());

    let assets: AssetDetails[] = [];

    data.records.forEach((record) => {
      assets = [...assets, ...extractAssetUrls(record)];
    });

    // Remove duplicates by id
    const uniqueAssets = assets.filter(
      (asset, index, self) =>
        index === self.findIndex((t) => t.key === asset.key)
    );

    let batches = [];
    const MAX_BATCH_SIZE = 100;

    for (let i = 0; i < uniqueAssets.length; i += MAX_BATCH_SIZE) {
      const batch: MessageSendRequest[] = uniqueAssets
        .slice(i, i + MAX_BATCH_SIZE)
        .map((asset) => ({
          body: {
            action: "download-image",
            data: asset,
          },
        }));

      batches.push(batch);
    }

    await Promise.all([
      ...batches.map((batch) => env.QUEUE.sendBatch(batch)),
      env.CACHE.put(cacheKey, JSON.stringify(data), {
        expirationTtl: ttl,
      }),
    ]);

    //
    // Return the data
    //

    // Make sure the page view request is sent to the queue
    await pageViewRequest;

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    const conn = connect({
      host: env.DB_HOST,
      username: env.DB_USER,
      password: env.DB_PASS,
    });

    await Promise.all([
      ...batch.messages.map(async (message) => {
        const parsedMessage = message.body as QueueMessage;

        switch (parsedMessage.action) {
          case "save-request":
            const requestDetails = parsedMessage.data as RequestDetails;

            await conn.execute(
              "INSERT INTO Request (createdAt, asn, continent, country, region, city, baseId, tableId, latitude, longitude, latlng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                requestDetails.createdAt,
                requestDetails.asn,
                requestDetails.continent,
                requestDetails.country,
                requestDetails.region,
                requestDetails.city,
                requestDetails.baseId,
                requestDetails.tableId,
                requestDetails.latitude,
                requestDetails.longitude,
                requestDetails.latlng,
              ]
            );
            break;

          case "download-image":
            const assetDetails = parsedMessage.data as AssetDetails;

            const record = await env.BUCKET.head(assetDetails.key);
            if (record) break;

            const image = await fetch(assetDetails.url).then((res) =>
              res.arrayBuffer()
            );

            await env.BUCKET.put(assetDetails.key, image);
            break;

          default:
            console.error("Unknown action: " + parsedMessage.action);
            break;
        }
      }),
    ]);
  },
};
