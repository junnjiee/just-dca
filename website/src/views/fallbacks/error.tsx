type ErrorFallbackProps = {
  error: { message: string };
};

export function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="h-screen">
      <div className="flex flex-row divide-x gap-x-4 mt-10">
        <p className="text-4xl font-bold text-nowrap self-center">
          404 &#x2602;
        </p>
        <div className="ps-4">
          <p>Welp, that's an error.</p>
          <div className="pt-5">
            <p>What we know:</p>
            <p className="text-red-500">{error.message}</p>
          </div>
          <div className="pt-5">
            <p>Pro Tip:</p>
            <p>
              We actually get our data from{' '}
              <a
                href="https://finance.yahoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Yahoo Finance
              </a>
              ! Please ensure that ticker names follow their convention. (e.g.
              for <b className="font-medium">VWRA</b>, use{' '}
              <b className="font-medium">VWRA.L</b> instead)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageNotFound() {
  return (
    <div className="h-screen flex flex-row justify-center items-center divide-x gap-x-4">
      <p className="text-4xl font-bold self-center text-nowrap">Uh oh!</p>
      <div className="ps-4 space-y-3">
        <p>You just stepped into no man's land.</p>
        <p>Maybe check your URL again?</p>
      </div>
    </div>
  );
}
