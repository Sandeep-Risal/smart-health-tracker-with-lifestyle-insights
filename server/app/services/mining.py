import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier
from .persistance import fetch_logs, upsert_insight
from datetime import date

def logs_to_dataframe(logs):
    if not logs:
        return pd.DataFrame()
    rows = []
    for l in logs:
        rows.append({
            "log_id": l.log_id,
            "user_id": l.user_id,
            "date": l.date,
            "steps": float(l.steps) if l.steps is not None else np.nan,
            "sleep_hours": float(l.sleep_hours) if l.sleep_hours is not None else np.nan,
            "water_liters": float(l.water_liters) if l.water_liters is not None else np.nan,
            "calories": float(l.calories) if l.calories is not None else np.nan,
            "energy_level": int(l.energy_level) if l.energy_level is not None else np.nan
        })
    return pd.DataFrame(rows)

def perform_mining_for_user(user_id:int):
    logs = fetch_logs(user_id)
    df = logs_to_dataframe(logs)
    if df.empty:
        return []

    # Impute medians
    for col in ["steps","sleep_hours","water_liters","calories"]:
        if col in df.columns:
            df[col].fillna(df[col].median(), inplace=True)

    # clustering (2 or 3 clusters)
    n_clusters = 2 if len(df) < 6 else 3
    try:
        X = df[["steps","sleep_hours","water_liters","calories"]].astype(float)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        df["cluster"] = kmeans.fit_predict(X)
    except Exception:
        df["cluster"] = 0

    # classification (if enough labeled energy rows)
    clf = None
    if df["energy_level"].notna().sum() >= 3:
        try:
            Xc = df[["steps","sleep_hours","water_liters","calories"]].astype(float)
            yc = df["energy_level"].astype(int)
            clf = DecisionTreeClassifier(max_depth=3, random_state=42)
            clf.fit(Xc, yc)
        except Exception:
            clf = None

    insights_written = []
    for idx, row in df.iterrows():
        texts = []
        if row["sleep_hours"] < 5 and row["water_liters"] < 1.5:
            texts.append("Low sleep (<5h) and low water (<1.5L) — fatigue risk likely.")
        if row["sleep_hours"] >= 7 and row["steps"] >= 10000:
            texts.append("Good recovery: >=7h sleep and >=10k steps — energy likely high.")
        if row["calories"] >= 2600 and row["steps"] < 5000:
            texts.append("High calories with low activity — consider increasing movement or adjusting intake.")
        if clf is not None:
            try:
                sample = [[float(row["steps"]), float(row["sleep_hours"]), float(row["water_liters"]), float(row["calories"])]]
                pred = int(clf.predict(sample)[0])
                texts.append(f"Model predicts energy level ≈ {pred} for this day.")
            except Exception:
                pass
        texts.append(f"Cluster {int(row.get('cluster',0))}: lifestyle pattern identifier.")
        full_text = " | ".join(texts)
        upsert_insight(user_id, row["date"], full_text)
        insights_written.append({"user_id":user_id, "date":str(row["date"]), "insight_text": full_text})
    return insights_written
