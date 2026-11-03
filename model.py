import pandas as pd
import numpy as np
import re
import nltk
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix
)
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB

import warnings
warnings.filterwarnings('ignore')

# --- 1. NLTK Downloads (run once) ---
# Note: These are for local training environments
# nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('omw-1.4')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# --- 2. Load Data ---
# Note: Ensure paths are relative or updated for your local environment
# df = pd.read_csv("Mental_Stress_Text.csv")

def clean_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words]
    return ' '.join(tokens)

# --- Best Performing Model Configuration (from research) ---
# Best Model: Random Forest (Accuracy: 91.9%)
# Features: TF-IDF (5000 features, ngram_range 1-2)
# Multi-class: 7 categories

if __name__ == "__main__":
    print("MindSense AI - Model Training Methodology")
    print("Classes: Anxiety, Bipolar, Depression, Normal, Personality Disorder, Stress, Suicidal")
