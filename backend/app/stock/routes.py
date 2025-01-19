from fastapi import APIRouter, status
import yfinance as yf
from ..lib.utils import check_ticker_validity

router = APIRouter()


@router.get("/info", status_code=status.HTTP_200_OK)
def get_ticker_info(ticker: str):
    print("LOG: hit /stock/info")
    stock = yf.Ticker(ticker)
    check_ticker_validity(stock)

    return stock.info
