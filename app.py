# app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import torch
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from transformers import AutoTokenizer
from model_class import IndoBERTClassifier

# ── Load semua artifacts ──────────────────────────────────
BASE = Path(__file__).parent

with open(BASE / "config.json", encoding="utf-8") as f:
    config = json.load(f)

tokenizer = AutoTokenizer.from_pretrained(str(BASE / "tokenizer"))
scaler    = joblib.load(BASE / "scaler.pkl")

device = torch.device("cpu")
model  = IndoBERTClassifier(num_classes=config["num_classes"])
model.load_state_dict(torch.load(BASE / "model_weights.pt", map_location=device))
model.eval()

URGENCY_KEYWORDS = config["urgency_keywords"]
LABEL_MAPPING    = {int(k): v for k, v in config["label_mapping"].items()}
NUMERIC_COLUMNS  = config["numeric_columns"]
MAX_LEN          = config["max_len"]

# ── FastAPI app ───────────────────────────────────────────
app = FastAPI(
    title       = "CitizenCare API",
    description = "API klasifikasi tingkat kerusakan infrastruktur",
    version     = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:5000"],  # ganti dengan domain website-mu saat production
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Request / Response schema ─────────────────────────────
class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    tingkat_kerusakan : str
    severity_score    : float
    confidence        : float
    probabilities     : dict
    deskripsi         : str

# ── Helper ────────────────────────────────────────────────
def calculate_urgency_score(text: str) -> int:
    text  = str(text).lower()
    score = 0
    for keyword in URGENCY_KEYWORDS:
        if keyword in text:
            score += 10
    if len(text.split()) > 20:
        score += 10
    return min(score, 100)

def predict(text: str) -> dict:
    text          = str(text)
    urgency_score = calculate_urgency_score(text)

    numeric_data = pd.DataFrame([{
        "char_length"        : len(text),
        "word_count"         : len(text.split()),
        "has_urgency_keyword": 1 if urgency_score > 0 else 0,
        "urgency_score"      : urgency_score
    }], columns=NUMERIC_COLUMNS)

    numeric_scaled = scaler.transform(numeric_data).astype("float32")
    numeric_tensor = torch.tensor(numeric_scaled).to(device)

    tokens = tokenizer(
        text,
        padding        = "max_length",
        truncation     = True,
        max_length     = MAX_LEN,
        return_tensors = "pt"
    ).to(device)

    with torch.no_grad():
        logits, pred_severity = model(
            input_ids      = tokens["input_ids"],
            attention_mask = tokens["attention_mask"],
            numeric_input  = numeric_tensor
        )

    pred_class_probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
    predicted_class  = int(np.argmax(pred_class_probs))
    confidence       = float(np.max(pred_class_probs) * 100)
    severity_score   = round(float(pred_severity.cpu().numpy()[0][0] * 100), 2)

    return {
        "tingkat_kerusakan": LABEL_MAPPING[predicted_class],
        "severity_score"   : severity_score,
        "confidence"       : round(confidence, 2),
        "probabilities"    : {
            LABEL_MAPPING[i]: round(float(p * 100), 2)
            for i, p in enumerate(pred_class_probs)
        },
        "deskripsi"        : text
    }

# ── Endpoints ─────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "CitizenCare API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictResponse)
def predict_endpoint(request: PredictRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Teks tidak boleh kosong")
    if len(request.text) > 2000:
        raise HTTPException(status_code=400, detail="Teks maksimal 2000 karakter")

    result = predict(request.text)
    return result