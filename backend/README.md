# just:dca Backend

The backend is built with Python [FastAPI](https://fastapi.tiangolo.com/), and hosted on [Vercel](https://vercel.com).

The purpose of this backend is to interact with the [yfinance](https://github.com/ranaroussi/yfinance) library and run the dollar-cost averaging calculations.

## Getting Started

This guide assumes you have [Python](https://www.python.org/) >= 3.10 installed and **optionally** set-up your Python environment.

1. Copy `.env.example` and rename to `.env`

2. Install project dependencies

```shell
pip install -r requirements.txt
```

3. Run the local development server

```shell
hypercorn app.main:app --reload --bind :::8000
```

[Hypercorn](https://pypi.org/project/Hypercorn/) is used as the ASGI server of choice.
