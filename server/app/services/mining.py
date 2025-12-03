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

def perform_mining_for_user(user_id: int, target_date: date = None):
    """
    Perform mining for a specific date. If target_date is provided, only mines that date.
    Otherwise mines all logs (for backward compatibility, but not recommended).
    """
    if target_date:
        # Only fetch logs for the specific date
        logs = fetch_logs(user_id, start_date=target_date, end_date=target_date)
    else:
        # Backward compatibility: fetch all logs
        logs = fetch_logs(user_id)
    
    df = logs_to_dataframe(logs)
    if df.empty:
        return []

    # For single-date mining, we might want to include some historical context
    # for better clustering/classification. Let's fetch recent logs for context.
    if target_date and len(logs) == 1:
        # Fetch last 30 days for context (but only mine the target date)
        context_logs = fetch_logs(user_id)
        context_df = logs_to_dataframe(context_logs)
        if not context_df.empty and len(context_df) > 1:
            # Use context for model training, but only generate insight for target_date
            df_for_training = context_df
        else:
            df_for_training = df
    else:
        df_for_training = df

    # Impute medians using training data
    for col in ["steps","sleep_hours","water_liters","calories"]:
        if col in df_for_training.columns:
            median_val = df_for_training[col].median()
            df[col].fillna(median_val, inplace=True)

    # clustering (2 or 3 clusters) - use training data
    n_clusters = 2 if len(df_for_training) < 6 else 3
    try:
        X_train = df_for_training[["steps","sleep_hours","water_liters","calories"]].astype(float)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        kmeans.fit(X_train)  # Fit on training data
        df["cluster"] = kmeans.predict(df[["steps","sleep_hours","water_liters","calories"]].astype(float))  # Predict on target data
    except Exception:
        df["cluster"] = 0

    # classification (if enough labeled energy rows in training data)
    clf = None
    if df_for_training["energy_level"].notna().sum() >= 3:
        try:
            Xc = df_for_training[["steps","sleep_hours","water_liters","calories"]].astype(float)
            yc = df_for_training["energy_level"].astype(int)
            clf = DecisionTreeClassifier(max_depth=3, random_state=42)
            clf.fit(Xc, yc)
        except Exception:
            clf = None

    insights_written = []
    for idx, row in df.iterrows():
        # Only generate insights for the target date (if specified)
        if target_date and row["date"] != target_date:
            continue
            
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
