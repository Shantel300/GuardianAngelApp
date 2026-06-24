from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .inference import ModelNotReadyError, ModelService
from .schemas import ClassificationRequest, ClassificationResult, HealthResponse

VERSION = "prototype-1"
service = ModelService()
logging.getLogger("uvicorn.access").disabled = True


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        service.load()
    except Exception:
        service.loaded = False
    yield


app = FastAPI(
    title="Guardian Angel AI API",
    version=VERSION,
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    lifespan=lifespan,
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(
    _: Request,
    __: RequestValidationError,
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Invalid message input."},
    )


@app.exception_handler(Exception)
async def generic_error_handler(_: Request, __: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "The classification service encountered an error."},
    )


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ready" if service.loaded else "degraded",
        modelLoaded=service.loaded,
        version=VERSION,
    )


@app.post("/classify", response_model=ClassificationResult)
def classify(payload: ClassificationRequest) -> ClassificationResult:
    try:
        return service.classify(payload.text)
    except ModelNotReadyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The classification model is not ready.",
        ) from exc

