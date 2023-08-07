from flask import Flask, request, jsonify
from pprint import pprint
import json
import re
# from gen import create_comment

import pandas as pd
import tensorflow as tf
import tensorflow_hub as hub


def write_json(d, file_path='/mnt/e/extension/with_be_and_ai/server/data.json'):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []

    # Extract the text from the 'data' field
    texts = [item.numpy().decode('utf-8') for item in d['data']]
    # pprint(f"pp text: {texts}")

    # Extract the predictions from the 'predictions' array
    predictions = d['predictions'][:, 0]  # Assuming it's a 1D array

    # Extract the id from the 'id' array
    ids = d['id']

    # Create a list of new objects with text and corresponding predictions
    new_objects = []
    for text, pred, id in zip(texts, predictions, ids):
        # comment = gen.create_comment(text)

        new_object = {
            'text': text,
            'pred': float(pred),
            'id': id,
            # 'comment': comment
            'comments': [
                "I think this is a good idea.",
                "it really cool",
                "ai is the future"
            ]
        }
        new_objects.append(new_object)

    # Insert an object into the array
    data.extend(new_objects)

    # # Write the updated data back to the JSON file
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

    print("Object inserted successfully.")
    data.clear()


def df_to_dataset(dataframe, batch_size=1024):
    df = dataframe.copy()
    df = df["Text"]
    ds = tf.data.Dataset.from_tensor_slices(df)
    ds = ds.batch(batch_size)
    ds = ds.prefetch(tf.data.AUTOTUNE)
    return ds


def preprocessing(input_df):
    single_input_df = pd.DataFrame(
        input_df, columns=['Text'])  # Set a dummy label
    processed_data = df_to_dataset(single_input_df)
    return processed_data


savedModel = tf.keras.saving.load_model("/mnt/e/extension/with_be_and_ai/server/mo/my_model.h5", custom_objects={'KerasLayer': hub.KerasLayer}
                                        )
app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.post("/predict")
def predict():
    json = request.json
    result = []
    id = []

    for data in json["data"]:
        if data["header"] and data["actor"]:
            result.append(data["commentary"]["text"]["text"])
            id.append(data["header"]["navigationContext"]["actionTarget"])

    me = preprocessing(result)
    for data in me:
        predictions = savedModel.predict(data)
        # print(f"Predictions: {predictions} on {data}")
        write_json({
            "predictions": predictions,
            "data": data,
            "id": id
        })
        pprint("sheeeeeeeeeeee")

    return "<p>predict</p>"


def get_data():
    with open('/mnt/e/extension/with_be_and_ai/server/data.json') as json_file:
        data = json.load(json_file)
        return data


@app.get("/ai_post")
def ai_post():
    p = get_data()
    filtered_data = [item for item in p if item['pred'] > 0.5093913722038269]

    return jsonify(filtered_data)


def preprocess_url(url):
    # Remove slashes and question marks from the URL
    return url.replace('/', '').replace('?', '')


@app.post("/comments")
def comments():
    jso = request.json

    p = get_data()
    filtered_data = [item for item in p if preprocess_url(
        item['id']) == preprocess_url(jso["tabUrl"])]
    pprint(filtered_data)

    if len(filtered_data) == 0:
        return jsonify({
            "comments": []
        })

    return jsonify({
        "comments": filtered_data[0]["comments"]
    })
