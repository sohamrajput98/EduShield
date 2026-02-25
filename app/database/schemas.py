from pydantic import BaseModel


class PredictionSchema(BaseModel):
    risk_score: float
    label: str