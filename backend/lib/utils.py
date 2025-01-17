from fastapi import HTTPException, status
import yfinance as yf
import pandas as pd


def check_ticker_validity(ticker: yf.Ticker):
    # no official way to check if ticker exists in yfinance
    if len(ticker.info) <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Ticker does not exist"
        )


def check_history_validity(history: pd.DataFrame):
    # check if ticker exists but no historical data
    if history.shape[0] == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Historical data not found for this ticker",
        )
