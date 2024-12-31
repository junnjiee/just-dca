from fastapi import APIRouter, status, HTTPException
import yfinance as yf

router = APIRouter()


@router.get("/returns", status_code=status.HTTP_200_OK)
def calculate_dca_returns(ticker: str, contri: float, start: str, end: str):
    stock = yf.Ticker(ticker)

    # no official way to check if ticker exists in yfinance
    if len(stock.info) <= 1:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Ticker does not exist"
        )

    # change start date day to first of month to get price of that month
    modified_start = start[:-2] + "01"

    history = stock.history(start=modified_start, end=end, interval="1mo")

    # check if ticker exists but no historical data
    if history.shape[0] == 0:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Historical data not found for this ticker",
        )

    # calculate relevant data points for each month
    table = []
    shares_owned = 0

    for i in range(0, history.shape[0]):
        data = {
            "stock_price": 0,
            "contribution": 0,
            "shares_bought": 0,
            "shares_owned": 0,
            "total_val": 0,  # total value of investment
        }
        data["stock_price"] = history["Open"].iloc[i]
        data["contribution"] = contri
        data["shares_bought"] = contri / history["Open"].iloc[i]

        shares_owned += data["shares_bought"]
        data["shares_owned"] = shares_owned

        # profit varies by which month stock is bought
        data["total_val"] = contri
        for row in table:
            data["total_val"] += row["contribution"] * (
                history["Open"].iloc[i] / row["stock_price"]
            )

        table.append(data)

    return table
