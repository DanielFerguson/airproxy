import Head from "next/head";
import LoginBtn from "../components/LoginBtn";

export default function Page() {
  return (
    <div>
      <Head>
        <title>Airproxy | Airtable in production, fearlessly.</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☁️</text></svg>"
        ></link>
      </Head>

      <main>
        <h1>Airproxy</h1>
        <p>Use Airtable in production, fearlessly.</p>
        <div>
          <LoginBtn />
        </div>
      </main>
    </div>
  );
}
