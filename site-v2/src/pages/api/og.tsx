import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../../fonts/Inter-ExtraBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function (req: NextRequest) {
  const fontData = await font;

  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title");

  if (!title) {
    return new ImageResponse(<>Visit with &quot;?title=airproxy&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          fontFamily: '"Inter"',
          flexDirection: "column",
          backgroundColor: "white",
          backgroundImage: "url(https://www.airproxy.app/og-background.png)",
          paddingLeft: "60px",
          paddingTop: "40px",
        }}
      >
        <img
          src="https://www.airproxy.app/cloud.png"
          tw="h-36 w-36 -ml-4"
          height={100}
        />
        <h1
          tw="max-w-5xl font-[Inter] text-indigo-600"
          style={{ fontWeight: 80, fontSize: "90px" }}
        >
          {title}
        </h1>
        <div tw="flex items-center mt-12">
          <div tw="flex h-20 w-20 bg-indigo-600 rounded-full">
            <img
              src="https://www.airproxy.app/danferg.png"
              tw="h-20 w-20 rounded-full"
            />
          </div>
          <div tw="flex flex-col pl-6 font-bold gap-2">
            <h2 tw="text-3xl mb-0 pb-0 text-indigo-600">Dan Ferguson</h2>
            <h3 tw="mt-0 pt-0 text-2xl text-indigo-500">
              Co-founder; Airproxy
            </h3>
          </div>
        </div>
        {/* Author */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
