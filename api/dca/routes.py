from datetime import datetime
from fastapi import APIRouter, status
import yfinance as yf
import pandas as pd
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

    # pad dates if ticker IPO date is after input start date
    ipo_date = stock.history(period="max").index[0].strftime("%d %b %Y")
    dates = pd.date_range(start, ipo_date, freq="MS")
    for date in dates:
        table.append(
            {
                "date": date.strftime("%d %b %Y"),
                "stock_price": None,
                "shares_bought": None,
                "contribution": None,
                "shares_owned": None,
                "total_val": None,  # total value of investment
                "profit": None,
                "profitPct": None,
            }
        )

    for i in range(0, history.shape[0]):
        data = {
            "date": history.index[i].strftime("%d %b %Y"),
            "stock_price": history["Open"].iloc[i].round(2),
            "shares_bought": (contri / history["Open"].iloc[i]).round(2),
            "contribution": round(contri * (i + 1), 2),
            "shares_owned": 0,
            "total_val": 0,  # total value of investment
            "profit": 0,
            "profitPct": 0,
        }

        shares_owned += data["shares_bought"]
        data["shares_owned"] = round(shares_owned, 2)

        # profit varies by which month stock is bought
        total_val = contri
        for row in table:
            if row["stock_price"] is None:
                continue
            # P/L for that month = current price / price for that month * monthly contribution value
            total_val += contri * (history["Open"].iloc[i] / row["stock_price"])

        data["total_val"] = round(total_val, 2)
        data["profit"] = round(data["total_val"] - data["contribution"], 2)
        data["profitPct"] = round(data["profit"] / data["contribution"] * 100, 2)

        table.append(data)

    return table


# # For querying a list in URL params
# # https://fastapi.tiangolo.com/tutorial/query-params-str-validations/#query-parameter-list-multiple-values
# @router.get("/compare", status_code=status.HTTP_200_OK)
# def compare_dca_returns(
#     ticker: str,
#     contri: float,
#     start: str,
#     end: str,
#     comparisons: Annotated[list[str] | None, Query()],
# ):
#     return comparisons
