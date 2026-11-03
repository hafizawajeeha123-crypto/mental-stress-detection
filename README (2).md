Mental Stress Detection from Text using ML and NLP

A comparative study of six classical machine learning models for detecting **seven mental-health categories** from social media text. The best model, **Random Forest + TF-IDF**, reaches **91.9% accuracy** and a **0.92 macro F1-score**.

> Data Science project, BSCS 6th Semester, University of South Asia, Lahore.

---
Objectives

- Compare six classical ML classifiers on seven-class mental-health text classification
- Analyse per-class F1-scores to find the easiest and hardest categories
- Study misclassification patterns and their clinical significance
- Outline a roadmap toward transformer-based models (BERT, MentalBERT)

Dataset

Social media and mental-health forum posts (`Mental_Stress_Text.csv`, sourced from Kaggle). Each row has a `statement` (text) and a `status` (label).

| Class | Original | After balancing |
|---|---|---|
| Normal | 19,475 | 33,722 |
| Depression | 18,756 | 33,021 |
| Suicidal | 17,205 | 29,706 |
| Anxiety | 16,921 | 28,725 |
| Stress | 16,483 | 29,387 |
| Bipolar | 9,144 | 29,268 |
| Personality Disorder | 14,378 | 28,533 |
| **Total** | **112,362** | **212,362** |

Classes were balanced with light text augmentation (sentence rewording, small spelling noise, filler words).

> The dataset file is **not included** in this repository because of its size. Download it from Kaggle and place it in the `data/` folder.

Pipeline

1. **Clean text:** lowercase, remove URLs, hashtags, punctuation, numbers
2. **Tokenize, remove stopwords, lemmatize** (NLTK)
3. **TF-IDF features:** top 5,000 unigrams + bigrams
4. **Train six classifiers** on an 80/20 stratified split (`random_state=42`)
5. **Evaluate:** accuracy, macro precision / recall / F1, per-class F1, confusion matrix

Models

Logistic Regression · K-Nearest Neighbors · Decision Tree · **Random Forest** · Linear SVM · Naive Bayes

## 📊 Results

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---|---|---|---|
| Logistic Regression | 87.1% | 88% | 88% | 88% |
| K-Nearest Neighbors | 78.7% | 84% | 80% | 81% |
| Decision Tree | 87.1% | 88% | 88% | 88% |
| **Random Forest ⭐** | **91.9%** | **93%** | **92%** | **92%** |
| Linear SVM | 87.8% | 89% | 89% | 89% |
| Naive Bayes | 78.6% | 81% | 80% | 81% |

### Per-class F1 (Random Forest)

| Anxiety | Bipolar | Depression | Normal | Pers. Disorder | Stress | Suicidal |
|---|---|---|---|---|---|---|
| 0.955 | 0.974 | 0.856 | 0.931 | 0.973 | 0.951 | 0.854 |

### Charts

![Model accuracy comparison](images/accuracy_comparison.png)
![Precision, recall, F1](images/prf_comparison.png)
![Confusion matrix](images/confusion_matrix.png)
![Per-class F1](images/class_f1.png)

 How to Run

```bash
git clone https://github.com/hafizawajeeha123-crypto/mental-stress-detection.git
cd mental-stress-detection

python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS / Linux

pip install -r requirements.txt
```

Download the NLTK resources once:

```python
import nltk
nltk.download("stopwords")
nltk.download("wordnet")
nltk.download("punkt")
```

Place `Mental_Stress_Text.csv` inside `data/`, then run:

```bash
python mental_stress_detection.py
```

## 🛠️ Tech Stack
Python 3.12 · scikit-learn · NLTK · pandas · NumPy · matplotlib · seaborn · VS Code


