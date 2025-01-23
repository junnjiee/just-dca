export function Footer() {
  return (
    <div className="border-t py-7 text-sm">
      <div className="space-y-10 px-3 mb-[4em] md:ps-10 md:w-2/3 lg:w-1/2">
        <p>
          Looking to report a bug or suggest a feature? Open an{" "}
          <a
            href="https://github.com/junnjiee16/just-dca/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            issue
          </a>
          .
        </p>
        <p>
          Disclaimer: All figures shown are in the US Dollar. Actual numbers may
          vary per individual due to taxes, fees, and other factors not listed.
          Market data is retrieved from{" "}
          <a
            href="https://finance.yahoo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Yahoo Finance
          </a>{" "}
          using{" "}
          <a
            href="https://github.com/ranaroussi/yfinance"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            yfinance
          </a>
          . Content is for informational/educational purposes only and should
          not be interpreted as financial advice.
        </p>
      </div>
    </div>
  );
}
