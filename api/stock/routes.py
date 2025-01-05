from fastapi import APIRouter, status
import yfinance as yf
from api.lib.utils import check_ticker_validity, check_history_validity

router = APIRouter()


@router.get("/info", status_code=status.HTTP_200_OK)
def get_ticker_info(ticker: str):
    stock = yf.Ticker(ticker)
    check_ticker_validity(stock)

    return stock.info


@router.get("/history", status_code=status.HTTP_200_OK)
def get_ticker_history(ticker: str, start: str, end: str):
    stock = yf.Ticker(ticker)
    check_ticker_validity(stock)

    history = stock.history(start=start, end=end, interval="1mo")
    check_history_validity(history)

    history = history.reset_index()
    history["Date"] = history["Date"].dt.strftime("%d %b %Y")

    return history.to_json(orient="records")
