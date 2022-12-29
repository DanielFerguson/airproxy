import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default async function () {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage: "url(https://www.airproxy.app/og-background.png)",
        }}
      >
        <div tw="bg-gray-50 flex">Hello</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
