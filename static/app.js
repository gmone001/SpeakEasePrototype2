 document.addEventListener("DOMContentLoaded", function() {
        let phrases = []; //holding the phrases for autocomplete
        
        fetch("/get-phrases")
            .then(response => response.json())
            .then(data => {
                phrases = data;
            })
            .catch(error => console.error('Error loading phrases:', error));

        const phraseInput = document.getElementById("phraseInput");
        const autocompleteList = document.getElementById("autocompleteList");

        function clearAutocomplete() {
            autocompleteList.innerHTML = '';
        }

        function showSuggestions(inputText) {
            clearAutocomplete();
            if (!inputText) return;

            phrases.filter(phrase => phrase.toLowerCase().includes(inputText.toLowerCase()))
                .forEach(phrase => {
                    let item = document.createElement("div");
                    item.textContent = phrase;
                    item.addEventListener("click", function() {
                        phraseInput.value = phrase;
                        clearAutocomplete();
                    });
                    autocompleteList.appendChild(item);
                });
        }

        phraseInput.addEventListener("input", function() {
            showSuggestions(this.value);
        });

        let recognition;
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onstart = function() {
                document.getElementById('speechStatus').textContent = "Listening... Please speak.";
                document.getElementById('stopListeningButton').style.display = 'inline';
            };

            recognition.onresult = function(event) {
                let speechResult = event.results[0][0].transcript;
                phraseInput.value = speechResult;
                document.getElementById('speechStatus').textContent = "";
                document.getElementById('stopListeningButton').style.display = 'none';
                showSuggestions(speechResult);
            };

            recognition.onend = function() {
                document.getElementById('speechStatus').textContent = "";
                document.getElementById('stopListeningButton').style.display = 'none';
            };

            recognition.onerror = function(event) {
                document.getElementById('speechStatus').textContent = 'Error in speech recognition: ' + event.error;
            };
            
            document.getElementById('startListeningButton').onclick = function() {
                recognition.start();
            };
            
            document.getElementById('stopListeningButton').onclick = function() {
                recognition.stop();
                document.getElementById('speechStatus').textContent = "Microphone turned off.";
            };
        } else {
            document.getElementById('voiceSupportWarning').textContent = "Voice input is not supported in this browser.";
            document.getElementById('startListeningButton').style.display = 'none';
        }
        document.getElementById('translateButton').addEventListener('click', function() {
    const selectedPhrase = phraseInput.value;

    //check there's input to translate
    if (!selectedPhrase.trim()) {
        alert('Please enter or say a phrase to translate.');
        return;
    }

    fetch('/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // use the selected phrase to properly send it within the request
        body: `phrase=${encodeURIComponent(selectedPhrase)}`
    })
    .then(response => response.json())
    .then(data => {
        if(data.translation){
            document.getElementById('translationResult').textContent = data.translation;

            //take the text-to-speech function to read out the translation
            if ('speechSynthesis' in window) {
                var msg = new SpeechSynthesisUtterance(data.translation);
                msg.lang = 'es-ES'; // Set the language to Spanish (Spain)
                window.speechSynthesis.speak(msg);
            } else {
                console.error('Text-to-speech is not supported in this browser.');
            }
        } else {
            //if translation is not found or there's an error, display a message
            document.getElementById('translationResult').textContent = data.error || "Translation not available.";
        }
    })
    .catch(error => {
        console.error('Error translating phrase:', error);
        document.getElementById('translationResult').textContent = "Error during translation process.";
    });
});

    });
