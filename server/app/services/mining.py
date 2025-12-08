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
            "avg_heart_rate": float(l.avg_heart_rate) if l.avg_heart_rate is not None else np.nan,
            "energy_level": int(l.energy_level) if l.energy_level is not None else np.nan
        })
    return pd.DataFrame(rows)

def generate_insight(row, clf=None):
    """
    Generate meaningful health insights based on health metrics.
    Returns a tuple of (insight_text, status) where status is "good", "bad", or "neutral"
    """
    steps = row["steps"]
    sleep = row["sleep_hours"]
    water = row["water_liters"]
    calories = row["calories"]
    heart_rate = row.get("avg_heart_rate", np.nan)
    energy = row.get("energy_level", np.nan)
    
    insights = []
    status_scores = []  # Positive for good, negative for bad
    
    # Define thresholds
    LOW_STEPS = 5000
    GOOD_STEPS = 10000
    EXCELLENT_STEPS = 15000
    
    LOW_SLEEP = 6
    GOOD_SLEEP = 7
    EXCELLENT_SLEEP = 8
    
    LOW_WATER = 1.5
    GOOD_WATER = 2.0
    EXCELLENT_WATER = 2.5
    
    LOW_CALORIES = 1500
    GOOD_CALORIES = 2000
    HIGH_CALORIES = 2500
    
    # Analyze combinations of metrics for meaningful insights
    
    # 1. Dehydration and Low Energy Patterns
    if not pd.isna(water) and not pd.isna(sleep) and not pd.isna(steps):
        if water < LOW_WATER and sleep < LOW_SLEEP and steps < LOW_STEPS:
            insights.append("⚠️ Dehydration risk: Low water intake, insufficient sleep, and minimal activity detected. This combination can lead to fatigue, headaches, and reduced cognitive function. Increase water intake to at least 2L and aim for 7-8 hours of sleep.")
            status_scores.append(-3)
        elif water < LOW_WATER and sleep < LOW_SLEEP:
            insights.append("⚠️ Low hydration and poor sleep quality detected. Dehydration combined with sleep deprivation can significantly impact your energy levels and overall well-being.")
            status_scores.append(-2)
        elif water < LOW_WATER and steps < LOW_STEPS:
            insights.append("⚠️ Low water intake with minimal activity. Staying hydrated is crucial, especially when inactive. Aim for at least 2L of water daily.")
            status_scores.append(-2)
    
    # 2. Excellent Health Patterns
    if not pd.isna(sleep) and not pd.isna(steps) and not pd.isna(water):
        if sleep >= EXCELLENT_SLEEP and steps >= EXCELLENT_STEPS and water >= EXCELLENT_WATER:
            insights.append("🌟 Excellent day! Optimal sleep, high activity, and great hydration. Your body is well-recovered and energized. Keep up this healthy routine!")
            status_scores.append(3)
        elif sleep >= GOOD_SLEEP and steps >= GOOD_STEPS and water >= GOOD_WATER:
            insights.append("✅ Great balance! Good sleep, active day, and proper hydration. Your health metrics are in a healthy range.")
            status_scores.append(2)
    
    # 3. Sleep Quality Analysis
    if not pd.isna(sleep):
        if sleep < 5:
            insights.append("😴 Critical sleep deprivation: Less than 5 hours of sleep. This can severely impact your immune system, mood, and cognitive performance. Prioritize getting 7-9 hours of quality sleep.")
            status_scores.append(-3)
        elif sleep < LOW_SLEEP:
            insights.append("😴 Insufficient sleep: Less than 6 hours. Aim for 7-9 hours for optimal health and recovery.")
            status_scores.append(-2)
        elif sleep >= EXCELLENT_SLEEP:
            insights.append("😴 Excellent sleep duration! 8+ hours of sleep supports optimal recovery and cognitive function.")
            status_scores.append(2)
    
    # 4. Activity Level Analysis
    if not pd.isna(steps):
        if steps < 3000:
            insights.append("🚶 Very low activity level. Regular movement is essential for cardiovascular health. Try to incorporate short walks throughout the day.")
            status_scores.append(-2)
        elif steps < LOW_STEPS:
            insights.append("🚶 Low activity detected. Aim for at least 5,000 steps daily for basic health benefits, or 10,000 for optimal fitness.")
            status_scores.append(-1)
        elif steps >= EXCELLENT_STEPS:
            insights.append("🏃 Excellent activity level! 15,000+ steps shows great commitment to physical fitness. Keep it up!")
            status_scores.append(2)
        elif steps >= GOOD_STEPS:
            insights.append("🚶 Good activity level! 10,000+ steps daily supports cardiovascular health and weight management.")
            status_scores.append(1)
    
    # 5. Hydration Analysis
    if not pd.isna(water):
        if water < 1.0:
            insights.append("💧 Critical dehydration risk: Less than 1L of water. Severe dehydration can cause headaches, fatigue, and kidney stress. Drink at least 2-2.5L daily.")
            status_scores.append(-3)
        elif water < LOW_WATER:
            insights.append("💧 Low hydration: Less than 1.5L of water. Proper hydration is essential for energy, digestion, and overall health. Aim for 2-2.5L daily.")
            status_scores.append(-2)
        elif water >= EXCELLENT_WATER:
            insights.append("💧 Excellent hydration! 2.5L+ of water supports optimal body function and energy levels.")
            status_scores.append(2)
        elif water >= GOOD_WATER:
            insights.append("💧 Good hydration level! Maintaining 2L+ of water daily supports your body's functions.")
            status_scores.append(1)
    
    # 6. Calorie and Activity Balance
    if not pd.isna(calories) and not pd.isna(steps):
        if calories >= HIGH_CALORIES and steps < LOW_STEPS:
            insights.append("⚖️ Calorie imbalance: High calorie intake with low activity. Consider increasing daily movement or adjusting your diet to match your activity level.")
            status_scores.append(-2)
        elif calories < LOW_CALORIES and steps >= GOOD_STEPS:
            insights.append("⚖️ Low calorie intake with high activity. Ensure you're eating enough to fuel your body and support recovery.")
            status_scores.append(-1)
        elif calories >= GOOD_CALORIES and calories <= HIGH_CALORIES and steps >= GOOD_STEPS:
            insights.append("⚖️ Well-balanced nutrition and activity! Your calorie intake matches your activity level.")
            status_scores.append(1)
    
    # 7. Heart Rate Analysis (if available)
    if not pd.isna(heart_rate):
        if heart_rate > 100:
            insights.append("❤️ Elevated resting heart rate detected. This may indicate stress, dehydration, or overexertion. Monitor and consider rest if persistent.")
            status_scores.append(-1)
        elif 60 <= heart_rate <= 80:
            insights.append("❤️ Healthy resting heart rate. Your cardiovascular system is functioning well.")
            status_scores.append(1)
    
    # 8. Energy Level Analysis (if available)
    if not pd.isna(energy):
        if energy <= 6:
            insights.append("🔋 Low self-reported energy level. Consider factors like sleep quality, hydration, and nutrition that may be affecting your energy.")
            status_scores.append(-2)
        elif energy >= 7:
            insights.append("🔋 High energy level reported! Your lifestyle choices are supporting your vitality.")
            status_scores.append(2)
    
    # 9. Machine Learning Prediction (if model available)
    if clf is not None:
        try:
            sample = [[float(steps), float(sleep), float(water), float(calories)]]
            pred = int(clf.predict(sample)[0])
            if pred <= 2:
                insights.append(f"🤖 AI predicts low energy level ({pred}/5) based on your metrics. Focus on improving sleep, hydration, and activity.")
                status_scores.append(-1)
            elif pred >= 4:
                insights.append(f"🤖 AI predicts high energy level ({pred}/5) based on your health metrics. Great job!")
                status_scores.append(1)
        except Exception:
            pass
    
    # Determine overall status
    if not status_scores:
        status = "neutral"
        insights.append("📊 Health data recorded. Continue tracking to receive personalized insights.")
    else:
        total_score = sum(status_scores)
        if total_score >= 3:
            status = "good"
        elif total_score <= -3:
            status = "bad"
        else:
            status = "neutral"
    
    # Combine all insights
    if not insights:
        insight_text = "📊 Health data recorded. Continue tracking to receive personalized insights."
        status = "neutral"
    else:
        insight_text = " <br/> ".join(insights)
    
    return insight_text, status

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
    
    # Also impute avg_heart_rate if available
    if "avg_heart_rate" in df_for_training.columns:
        median_hr = df_for_training["avg_heart_rate"].median()
        df["avg_heart_rate"] = df["avg_heart_rate"].fillna(median_hr)

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
        
        insight_text, status = generate_insight(row, clf)
        upsert_insight(user_id, row["date"], insight_text, status)
        insights_written.append({
            "date": str(row["date"]), 
            "insight_text": insight_text,
            "status": status
        })
    return insights_written