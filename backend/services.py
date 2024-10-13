import time
import json
import pandas as pd
from config import config, models, inference_pipeline, train_pipeline
import cloudpickle

from typing import Tuple
from sklearn.linear_model import LogisticRegression

def infer_from_model(modelname: str, dataframe: pd.DataFrame)->pd.DataFrame:
    if inference_pipeline:

        if modelname not in models:
            raise Exception("Model does not exist")

        inference_pipeline.named_steps['predicting'].model = models[modelname][0]
        return inference_pipeline.fit_transform(dataframe)
    raise Exception("Cannot infer from model without inference pipeline loaded")

def train_from_model(dataframe: pd.DataFrame)->Tuple[LogisticRegression, dict]:
    if train_pipeline:
        return train_pipeline.fit_transform(dataframe)
    raise Exception("Cannot train from model without training pipeline loaded")

# NOTE: Stats includes both `get_statistics` and a 'source' key for the source model
def load_into_models(modelname: str, regression: LogisticRegression, dataset: pd.DataFrame, stats: dict):
    filename = "{}-{}.pkl".format(modelname, int(time.time()))

    config['models'][modelname] = stats
    config['models'][modelname]['filename'] = filename
    models[modelname] = (regression, dataset)

    with open("inference_models/" + filename, "wb") as mf:
        cloudpickle.dump((regression, dataset), mf)

    with open("config.json", "w") as cf:
        json.dump(config, cf, indent=4)

def combine_data_from_models(modelname: str, data: pd.DataFrame):
    return pd.concat([data, models[modelname][1]])

def get_models():
    return [{
        "name": name,
        "source": modelinfo['source'],
        "precision": modelinfo['precision'],
        "recall": modelinfo['recall'],
        "f1": modelinfo['f1'],
    } for name, modelinfo in config["models"].items()]

def get_model(modelname: str):
    modelinfo = config["models"][modelname]
    return {
        "name": modelname,
        "source": modelinfo['source'],
        "precision": modelinfo['precision'],
        "recall": modelinfo['recall'],
        "f1": modelinfo['f1'],
    } 
