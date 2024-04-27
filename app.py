from flask import Flask, render_template, jsonify, request
import pandas as pd
import os
import re
from rapidfuzz import process, fuzz

app = Flask(__name__)

def normalize_text(text):
    """Normalize text by converting to lowercase and removing non-alphanumeric characters."""
    text = text.lower()  #convert to lowercase
    text = re.sub(r'[^\w\s]', '', text)  #remove punctuation
    return text

def load_dataset():
    """Load and normalize the dataset."""
    print("Loading dataset...")
    #HELPING me not hardcode the path!! Gracie
    dataset_path = os.path.join(os.path.dirname(__file__), 'data.csv')
    dataset = pd.read_csv(dataset_path)
    # normalize to the 'english' column and store in a new column
    dataset['english_normalized'] = dataset['english'].apply(normalize_text)
    print("Dataset loaded successfully.")
    print(dataset.columns)
    return dataset

#call load_dataset function and store the returned DataFrame in a global variable
dataset = load_dataset()

@app.route('/')
def home():
    #Serve the home page
    return render_template('home.html')

@app.route('/about')
def about():
    """Serve the about page."""
    return render_template('about.html')

@app.route('/contact')
def contact():
    """Serve the contact page."""
    return render_template('contact.html')

@app.route('/get-phrases')
def get_phrases():
    #Return a list of unique phrases
    try:
        phrases = sorted(list(set(dataset['english'].tolist())))  #get unique phrases
        return jsonify(phrases)
    except Exception as e:
        print(f"Error fetching phrases: {e}")
        return jsonify({"error": "Error fetching phrases"}), 500

@app.route('/translate', methods=['POST'])
def translate():
   #endpoint to handle translation requests using fuzzy matching
    try:
        english_phrase = request.form['phrase']
        normalized_input = normalize_text(english_phrase)  #normalize the input

        # fuzzy matching to find the best match in the dataset
        best_match = process.extractOne(normalized_input, dataset['english_normalized'], scorer=fuzz.WRatio)
        
        if best_match and best_match[1] > 80:  #check if the score is above 80
            best_match_text = best_match[0]
            translation = dataset.loc[dataset['english_normalized'] == best_match_text, 'spanish'].values
            if len(translation) > 0:
                return jsonify({"translation": translation[0]})
            else:
                return jsonify({"error": "Translation not found even after matching."}), 404
        else:
            return jsonify({"error": "No suitable match found. Match score too low."}), 404
    except Exception as e:
        print(f"Error translating phrase: {e}")
        return jsonify({"error": "Error during translation"}), 500

if __name__ == '__main__':
    app.run(debug=True)
