from fastapi import APIRouter, HTTPException
import pandas as pd

from models import FitParameters, TransformParameters
from services import combine_data_from_models, infer_from_model, load_into_models, train_from_model, get_models, get_model

router = APIRouter()

@router.get("/")
def home():
    return "El API del proyecto de BI (parte 2) se encuentra activo"

@router.post("/transform")
def transform(parameters: TransformParameters):

    df = pd.DataFrame({'Textos_espanol': map(lambda feature: feature.opinion, parameters.opinions)})
    
    result_df = pd.DataFrame()

    try:
        result_df = infer_from_model(parameters.model, df)
    except Exception as e:
        if e.args[0] == "Model does not exist":
            raise HTTPException(status_code=404, detail="Model not found")
        else:
            raise HTTPException(status_code=500, detail=e.args[0])

    result_df['proba'] = result_df['proba'].apply(lambda x: x.tolist())

    data = {
        'opinion': result_df['Textos_espanol'].tolist(),
        'prediction': result_df['prediction'].tolist(),
        'probability': result_df['proba'].tolist()
    }

    list_of_dicts = [
    {
        'opinion': opinion,
        'model': parameters.model,
        'prediction': prediction,
        'probability': probability
    }
    for opinion, prediction, probability in zip(data['opinion'], data['prediction'], data['probability'])]

    return list_of_dicts

@router.post("/fit")
def fit(parameters: FitParameters):

    df = pd.DataFrame({
        'Textos_espanol': map(lambda case: case.opinion, parameters.opinions),
        'sdg': map(lambda case: int(case.category), parameters.opinions)
    })

    new_data = combine_data_from_models(parameters.source, df)
    try:
        new_regression, statistics = train_from_model(new_data)
    except Exception as e:
        if e.args[0] == "Model does not exist":
            raise HTTPException(status_code=404, detail="Model not found")
        else:
            raise HTTPException(status_code=500, detail=e.args[0])
    
    for key in ['precision', 'recall', 'f1']:
        statistics[key] = str(round(statistics[key], 2))

    statistics['source'] = parameters.source

    load_into_models(parameters.name, new_regression, new_data, statistics)

    return get_model(parameters.name)

@router.get("/models")
def models():
    return get_models()
