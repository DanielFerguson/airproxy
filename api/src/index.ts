/**
 * Welcome to Cloudflare Workers!
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
  KV_STORE: KVNamespace;
  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const { method, url } = request;
    const path = url.replace("https://airproxy-api.gday.workers.dev", "");

    switch (true) {
      case path === "/" && method === "GET":
        return testFn(env);

      default:
        return new Response("Uh oh... something went wrong.");
    }
  },
};

const testFn = async (env: Env): Promise<Response> => {
  let value = await env.KV_STORE.get("todo:123");
  return new Response(value);
};
