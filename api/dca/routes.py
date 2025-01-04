from fastapi import APIRouter, status
import yfinance as yf
from api.lib.utils import check_ticker_validity, check_history_validity

router = APIRouter()


@router.get("/returns", status_code=status.HTTP_200_OK)
def calculate_dca_returns(ticker: str, contri: float, start: str, end: str):
    stock = yf.Ticker(ticker)
    check_ticker_validity(stock)

    history = stock.history(start=start, end=end, interval="1mo")
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
        data["stock_price"] = history["Open"].iloc[i].round(2)
        data["shares_bought"] = (contri / history["Open"].iloc[i]).round(2)
        data["contribution"] = round(contri * (i + 1), 2)

        shares_owned += data["shares_bought"]
        data["shares_owned"] = round(shares_owned, 2)

        # profit varies by which month stock is bought
        total_val = contri
        for row in table:
            # P/L for that month = current price / price for that month * contribution
            total_val += contri * (history["Open"].iloc[i] / row["stock_price"])

        data["total_val"] = round(total_val, 2)

        table.append(data)

    return table
