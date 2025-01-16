export function Footer() {
  return (
    <div className="border-t py-7 text-sm">
      <div className="space-y-10 px-3 md:ps-10 md:w-1/2">
        <p>
          Looking to report a bug or suggest a feature? Check out the{" "}
          <a
            href="https://github.com/junnjiee16/just-dca-lah"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub repo
          </a>
          .
        </p>
        <p>
          Disclaimer: All figures shown are in the US Dollar. Actual numbers may
          vary based on brokerage fees, time when stock was bought and other
          factors not listed. Market data is retrieved with{" "}
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
          . Make financial decisions at your own risk.
        </p>
      </div>
    </div>
  );
}
