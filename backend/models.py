from typing import List
from pydantic import BaseModel

class Features(BaseModel):
    opinion: str

class Case(Features):
    category: str

class TransformParameters(BaseModel):
    model: str
    opinions: List[Features]

class FitParameters(BaseModel):
    name: str
    source: str
    opinions: List[Case]
