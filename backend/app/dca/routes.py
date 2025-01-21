from fastapi import APIRouter, status
import yfinance as yf
import pandas as pd
from ..lib.utils import check_ticker_validity, check_history_validity

router = APIRouter()

dict_keys = (
    "padded_row",
    "date",
    "stock_price",
    "shares_bought",
    "contribution",
    "shares_owned",
    "total_val",
    "profit",
    "profitPct",
)


@router.get("/returns", status_code=status.HTTP_200_OK)
def calculate_dca_returns(ticker: str, contri: float, start: str, end: str):
    print("LOG: hit /dca/returns")
    stock = yf.Ticker(ticker)
    check_ticker_validity(stock)

    history = stock.history(start=start, end=end, interval="1mo")
    check_history_validity(ticker, history)

    table = []

    # pad dates if ticker IPO date is after input start date
    ipo_date = stock.history(period="max").index[0].strftime("%d %b %Y")
    dates = pd.date_range(start, ipo_date, freq="MS")
    for date in dates:
        data = dict.fromkeys(dict_keys, 0)
        data["padded_row"] = True
        data["date"] = date.strftime("%d %b %Y")
        table.append(data)

    shares_owned = 0

    for i in range(0, history.shape[0]):
        data = dict.fromkeys(dict_keys, 0)

        data["padded_row"] = False
        data["date"] = history.index[i].strftime("%d %b %Y")
        data["stock_price"] = history["Open"].iloc[i].round(2)
        data["shares_bought"] = (contri / history["Open"].iloc[i]).round(2)
        data["contribution"] = round(contri * (i + 1), 2)

        shares_owned += data["shares_bought"]
        data["shares_owned"] = round(shares_owned, 2)

        # profit varies by which month stock is bought
        total_val = contri
        for row in table:
            if row["padded_row"]:
                continue
            # revenue for share bought at month x =
            # current price / price at month x * monthly contribution value
            total_val += contri * (history["Open"].iloc[i] / row["stock_price"])

        data["total_val"] = round(total_val, 2)
        data["profit"] = round(data["total_val"] - data["contribution"], 2)
        data["profitPct"] = round(data["profit"] / data["contribution"], 4)

        table.append(data)

    return table
