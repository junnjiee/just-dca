from fastapi import FastAPI, status
from api.dca.routes import router as api_dca_router
from api.stock.routes import router as api_stock_router

app = FastAPI()

app.include_router(api_dca_router, prefix="/api/dca")
app.include_router(api_stock_router, prefix="/api/stock")


@app.get("/api", status_code=status.HTTP_200_OK)
def check_status():
    return {"message": "service up and running"}
