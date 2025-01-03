from fastapi import APIRouter, status
import yfinance as yf
from api.lib.utils import check_ticker_validity, check_history_validity

router = APIRouter()


@router.get("/returns", status_code=status.HTTP_200_OK)
def calculate_dca_returns(ticker: str, contri: float, start: str, end: str):
    stock = yf.Ticker(ticker)
    check_ticker_validity(stock)

    # change start date day to first of month to get price of that month
    modified_start = start[:-2] + "01"
    history = stock.history(start=modified_start, end=end, interval="1mo")
    check_history_validity(history)

    # calculate relevant data points for each month
    table = []
    shares_owned = 0

    for i in range(0, history.shape[0]):
        data = {
            "month": None,
            "stock_price": 0,
            "contribution": 0,
            "shares_bought": 0,
            "shares_owned": 0,
            "total_val": 0,  # total value of investment
        }
        data["date"] = history.index[i].strftime("%d %b %Y")
        data["stock_price"] = history["Open"].iloc[i]
        data["shares_bought"] = contri / history["Open"].iloc[i]
        data["contribution"] = contri * (i + 1)

        shares_owned += data["shares_bought"]
        data["shares_owned"] = shares_owned

        # profit varies by which month stock is bought
        data["total_val"] = contri
        for row in table:
            data["total_val"] += (
                contri * (history["Open"].iloc[i] / row["stock_price"])
            ).round(2)

        table.append(data)

    return table
