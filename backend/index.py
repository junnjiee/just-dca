from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from backend.dca.routes import router as api_dca_router
from backend.stock.routes import router as api_stock_router

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_dca_router, prefix="/api/dca")
app.include_router(api_stock_router, prefix="/api/stock")


@app.get("/", status_code=status.HTTP_200_OK)
def check_status():
    return {"message": "service up and running"}
