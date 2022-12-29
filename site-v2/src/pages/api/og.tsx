import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

const font = fetch(
  new URL("../../../fonts/Inter-ExtraBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function () {
  const fontData = await font;

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
          paddingLeft: "50px",
          paddingTop: "40px",
        }}
      >
        <img
          src="https://www.airproxy.app/cloud.png"
          tw="h-36 w-36 mb-12"
          height={100}
        />
        <h1
          tw="max-w-5xl font-[Inter] text-indigo-600"
          style={{ fontWeight: 80, fontSize: "90px" }}
        >
          Hello, world!
        </h1>
        <div tw="flex gap-12">
          <div tw="h-36 w-36 bg-indigo-600 rounded-full">
            <img src="https://www.airproxy.app/danferg.png" tw="h-36 w-36" />
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
