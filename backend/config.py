from sklearn.pipeline import Pipeline

import cloudpickle
import traceback
import nltk
import json

inference_pipeline : Pipeline | None = None
train_pipeline : Pipeline | None = None

nltk.download('punkt_tab')

config = {
  "models": {}
}

# NOTE: Models are tuples of a regression, and a dataset
models = {}

def load():
    global inference_pipeline, train_pipeline, config

    with open('config.json', 'r') as cf:
        config = json.load(cf)

    try:
        with open('pipelines/inference_pipeline.pkl', 'rb') as fp:
            inference_pipeline = cloudpickle.load(fp)
        with open('pipelines/train_pipeline.pkl', 'rb') as fp:
            train_pipeline = cloudpickle.load(fp)
    except:
        print("WARNING: Running without a pipeline; Run at your own risk")
        traceback.print_exc()
        return

    for name, modelinfo in config["models"].items():
        try:
            with open('inference_models/{}'.format(modelinfo['filename']), 'rb') as fp:
                model = cloudpickle.load(fp)
                models[name] = model
        except:
            print("WARNING: Model with name {} could not be loaded properly".format(name))
            traceback.print_exc()

load()
