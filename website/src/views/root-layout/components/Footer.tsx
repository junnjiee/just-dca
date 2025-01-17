export function Footer() {
  return (
    <div className="border-t py-7 text-sm">
      <div className="space-y-10 px-3 md:ps-10 md:w-2/3 lg:w-1/2">
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
          vary based on brokerage fees, exact date/time when stock was bought
          and other factors not listed. Market data is retrieved with{" "}
          <a
            href="https://github.com/ranaroussi/yfinance"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            yfinance
          </a>
          , A Python library to fetch financial data from{" "}
          <a
            href="https://finance.yahoo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Yahoo Finance
          </a>
          . Past results do not guarantee future returns. Make financial
          decisions at your own risk.
        </p>
      </div>
    </div>
  );
}
