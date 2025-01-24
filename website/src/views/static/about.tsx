export function AboutPage() {
  return (
    <div className="flex flex-col items-center mt-10 mx-2 h-screen">
      <div className="space-y-8 md:w-2/3 lg:w-3/4">
        <div>
          <h1 className="font-bold">What is DCA?</h1>
          <p className="text-sm italic">Why does it matter to me?</p>
        </div>
        <p>
          Dollar-cost averaging (or DCA) is an investment strategy where you
          invest a fixed amount of money in regular intervals (usually monthly
          or quarterly), regardless of market conditions.
        </p>
        <p>
          Personally, I believe that it's a great way to get started with
          investing, as one does not need to “time” the market, and it also
          takes emotions out of the equation, making this strategy easy to apply
          and follow through.
        </p>
        <p>
          My goal building this dashboard was to share how powerful dollar-cost
          averaging can be over a long time horizon, and maybe encourage some to
          start their own personal finance journey :)
        </p>
        <p>
          For those wanting to read more:
          <ul className="list-disc list-inside leading-7">
            <li>
              <a
                href="https://www.sc.com/sg/stories/dollar-cost-averaging/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800 text-blue-500"
              >
                How using Dollar Cost Averaging Will Build Long-Term Wealth |
                Standard Chartered
              </a>
            </li>
            <li>
              <a
                href="https://www.investopedia.com/terms/d/dollarcostaveraging.asp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800 text-blue-500"
              >
                Dollar-Cost Averaging (DCA) Explained With Examples and
                Considerations | Investopedia
              </a>
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
}
