Translation Assistant is a Flask web application designed to help users translate English phrases into Spanish. 
It supports both text input and speech recognition, making it accessible for a wide range of users. 
The application utilizes mtranslate for translations and speech_recognition for converting spoken language into text.

This is the second implemenation of the speakEase project. This development was close to implementing a language learning chatbot without using AI, or a paid API service.
However, it was an important implementation to guide me in the right direction of a language learning chatbot. 

Key Features

Text Translation: Translate text from English to Spanish.
Speech Recognition: Allows users to speak into their microphone to input text for translation.
Autocomplete Suggestions: Provides autocomplete suggestions for English phrases to translate.
Text-to-Speech: Outputs the Spanish translation using text-to-speech.
Responsive Web Design: Accessible via web browser on both desktop and mobile devices.


breakdown of the code:

Technologies Used

Backend: Flask (Python)
Translation: mtranslate
Speech Recognition: speech_recognition library
Frontend: HTML, CSS, JavaScript
Data Handling: Pandas for data management


The code imports necessary modules such as Flask, pandas, os, re, and rapidfuzz.
The Flask app is initialized.

The normalize_text function is defined to convert text to lowercase and remove non-alphanumeric characters.
Which became an issue when working with an existing dataset, especially one that included special characters from the spanish alphabet.


The load_dataset function is defined to load and normalize the translation dataset from a CSV file.
The dataset is loaded and normalized using the load_dataset function.

Several routes are defined for different pages (home, about, contact) using Flask's @app.route decorator.
The /get-phrases route returns a list of unique phrases from the dataset.

The /translate route handles translation requests by performing fuzzy matching on the input phrase and finding the best match in the dataset. 

Fuzzy matching became important when considering user experience and the liklyhood of making something more dynamic, more chat-like, and more accessable due to human errors.
If a suitable match is found, the corresponding translation is returned.

The Flask app is run with debug mode enabled.

This implementation is a slightly limited version but has the essence of a minimum viable product. 
It provides basic translation functionality using fuzzy matching, but there may be room for improvement and additional features.

Prerequisites
Python 3.6+
Pip (Python package manager)
Virtual environment (recommended)

pip install Flask pandas rapidfuzz mtranslate SpeechRecognition


Contact-
Graciella Monetti
gmone001@gold.ac.uk
