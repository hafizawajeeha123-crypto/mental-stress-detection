import pandas as pd
import numpy as np
import re # text cleaning (regex)
import nltk #NLP (text processing)
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

# --- 1. NLTK Downloads (run once) ---Toolkit (NLTK) to transform raw text into a format suitable
nltk.download('stopwords') #common words remove (like: the, is, am)
nltk.download('punkt') #tokenization (sentence → words)
nltk.download('wordnet') #lemmatization (words ko root form me lana)
nltk.download('omw-1.4') #also for lemmatization
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer #words ko basic bnana 
# --- 2. Load Data (fix file path warning) ---
df = pd.read_csv(r"D:\LAPTOP DATA\AI\model\Mental_Stress_Text.csv")
print("File loaded successfully")

print("Initial shape:", df.shape)
print(df['status'].value_counts())

# --- 3. Data Cleaning ---
df = df.drop(columns=['Unnamed: 0'], errors='ignore')  
df = df.dropna(subset=['statement', 'status'])
df = df[df['statement'].str.strip() != ''] # space hta rha ha
df = df.drop_duplicates(subset=['statement', 'status']) 

stop_words = set(stopwords.words('english')) 
lemmatizer = WordNetLemmatizer() #jesy running sy run

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text) #only letters or space bcz safe for noisy model
    text = re.sub(r'\s+', ' ', text).strip() 
    tokens = text.split() #sentence ko words mai kerti h 
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words] #common useless words remove
    return ' '.join(tokens) 

df['clean_statement'] = df['statement'].apply(clean_text)
df = df[df['clean_statement'].str.strip() != ''] #cleaned row del

print("Cleaned shape:", df.shape) 

# --- 4. Label Encoding --- 
label_encoder = LabelEncoder()
df['label'] = label_encoder.fit_transform(df['status']) #learn and convert krta
print("Classes:", label_encoder.classes_) #tell us kis number k kia label h

# --- 5. TF‑IDF Feature Extraction --- trem frequency inverse doc f (features) convert
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2)) #single or two combination words
X = vectorizer.fit_transform(df['clean_statement']) #text to numeric matrix
y = df['label'] #model prediction in output

print("X shape:", X.shape) #size

# --- 6. Train/Test Split---80% and 20% train and test 
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
) # class distribution same rhy

# --- 7. Dimensionality Reduction for KNN ---reduce 5000 to 200
svd = TruncatedSVD(n_components=200, random_state=42)# Dimensionality Reduction
X_svd = svd.fit_transform(X)                
X_train_svd, X_test_svd, _, _ = train_test_split(
    X_svd, y, test_size=0.2, random_state=42, stratify=y) #data ko 200 dimen mai convert kry ga

# --- 8. Define Models ---
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, class_weight='balanced'),
    'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=5),
    'Decision Tree': DecisionTreeClassifier(class_weight='balanced'),
    'Random Forest': RandomForestClassifier(n_estimators=100, class_weight='balanced', n_jobs=-1),
    'Linear SVM': LinearSVC(class_weight='balanced', max_iter=2000), #class separateline
    'Naive Bayes': MultinomialNB() #probability based
}

# --- 9. Single Evaluation Loop --- train and check for best model
results = []
model_names = []
accuracy_scores = []

for name, model in models.items():
    print(f"\n--- {name} ---")
    if name == 'K-Nearest Neighbors':
        #KNN ke liye SVD reduced data use ho raha hai
        model.fit(X_train_svd, y_train)
        y_pred = model.predict(X_test_svd)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

    # Calculate metrics
    acc = accuracy_score(y_test, y_pred) 
    prec = precision_score(y_test, y_pred, average='macro', zero_division=0) #false positive actual
    rec = recall_score(y_test, y_pred, average='macro') #false negative kitne detected
    f1 = f1_score(y_test, y_pred, average='macro') #Precision and Recall ka harmonic mean (balance metric)

    results.append({
        'Model': name,
        'Accuracy': acc,
        'Precision': prec,
        'Recall': rec, 
        'F1-Score': f1 
    })
    model_names.append(name)
    accuracy_scores.append(acc)

    print(f"Accuracy: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f}")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_, zero_division=0))

# --- 10. Results Table ---
results_df = pd.DataFrame(results).set_index('Model')
print("\n📊 All model results (sorted by Accuracy):")
print(results_df.sort_values(by='Accuracy', ascending=False))

# --- 11. Visualizations ---
# Accuracy bar chart
plt.figure(figsize=(10,5))
bars = plt.bar(model_names, accuracy_scores, color='skyblue')
plt.title('Model Accuracy Comparison')
plt.xticks(rotation=45)
plt.ylabel('Accuracy')
plt.ylim(0,1)
for bar, val in zip(bars, accuracy_scores):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height()+0.01, f'{val:.3f}', ha='center')
plt.tight_layout()
plt.show()

# Precision/Recall/F1 bar chart
results_df[['Precision','Recall','F1-Score']].plot(kind='bar', figsize=(10,6))
plt.title('Precision, Recall, F1-Score per Model (macro avg)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Confusion matrix for best model (by F1) # graphically represent
best_model_name = results_df['F1-Score'].idxmax()
best_model = models[best_model_name]
if best_model_name == 'K-Nearest Neighbors':
    y_pred_best = best_model.predict(X_test_svd)
else:
    y_pred_best = best_model.predict(X_test)

cm = confusion_matrix(y_test, y_pred_best)
plt.figure(figsize=(8,6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=label_encoder.classes_,
            yticklabels=label_encoder.classes_)
plt.title(f'Confusion Matrix - {best_model_name}')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.tight_layout()
plt.show()