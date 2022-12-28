import Script from "next/script";

const LemonSqueezy = () => {
  return (
    <>
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        defer
        onReady={() => {
          // @ts-ignore
          window.createLemonSqueezy();
        }}
      />
    </>
  );
};

export default LemonSqueezy;
