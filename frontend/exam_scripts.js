document.addEventListener('DOMContentLoaded', () => {
    const proctorVideo = document.getElementById('proctor-video');
    const answerBox = document.getElementById('answer-box');
    const questionText = document.getElementById('question-text');
    const questionNumber = document.getElementById('question-number');
    const prevBtn = document.getElementById('prev-question-btn');
    const nextBtn = document.getElementById('next-question-btn');
    const saveBtn = document.getElementById('save-answer-btn');
    const submitBtn = document.getElementById('submit-exam-btn');
    const notificationBox = document.getElementById('notification-box');
    const notificationMessage = document.getElementById('notification-message');
    const okBtn = document.getElementById('ok-btn');
    const voiceStatus = document.getElementById('voice-recording-status');
    const readQuestionBtn = document.getElementById('read-question-btn');
    const questionButtonsContainer = document.getElementById('question-buttons');
    const timerDisplay = document.getElementById('timer-display');
    
    // Voice-to-text and text-to-speech
    let recognition;
    let synth = window.speechSynthesis;
    let isSpeaking = false;
    let inTranscriptionMode = false;
    
    // Exam data and state (Example data; this would come from your backend)
    const examQuestions = [
        { id: 1, text: 'What is your name?', answer: '' },
        { id: 2, text: 'How do you spell your name?', answer: '' },
        { id: 3, text: 'Tell me about yourself.', answer: '' },
    ];
    let currentQuestionIndex = 0;
    
    // Timer Variables
    const examDurationInMinutes = 60;
    let timeRemaining = examDurationInMinutes * 60;
    let timerInterval;

    // Define voice commands and their actions
    const voiceCommands = {
        'read question': () => {
            readQuestionBtn.click();
        },
        'save answer': () => {
            saveBtn.click();
        },
        'next question': () => {
            nextBtn.click();
        },
        'previous question': () => {
            prevBtn.click();
        },
        'submit exam': () => {
            submitBtn.click();
        },
        'start answering': () => {
            inTranscriptionMode = true;
            answerBox.placeholder = "Listening for your answer...";
            speakMessage("You can now start answering.");
        },
        'stop answering': () => {
            inTranscriptionMode = false;
            answerBox.placeholder = "Say 'Start Answering' to begin transcribing.";
            speakMessage("Transcription stopped.");
        },
        'ok': () => {
            if (notificationBox.style.display === 'block') {
                okBtn.click();
            }
        }
    };
    
    // Timer function
    const startTimer = () => {
        timerInterval = setInterval(() => {
            timeRemaining--;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                submitExam(); // Auto-submit when time runs out
            }
        }, 1000);
    };

    // Start webcam for proctoring
    const startProctoring = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            proctorVideo.srcObject = stream;
            voiceStatus.textContent = 'Voice recording ON...';
            // Start voice recognition as soon as the video feed is on
            startVoiceRecognition();
            startTimer();
        } catch (err) {
            console.error('Error accessing media devices:', err);
            alert('Could not start proctoring. Please allow camera and microphone access.');
        }
    };

    // Text-to-Speech function
    const speakMessage = (message, callback) => {
        const utterance = new SpeechSynthesisUtterance(message);
        isSpeaking = true;
        
        // Stop recognition while speaking
        if (recognition) {
            recognition.stop();
        }

        utterance.onend = () => {
            isSpeaking = false;
            if (callback) callback();
            // Resume recognition after speaking is complete
            if (recognition) {
                recognition.start();
            }
        };
        synth.speak(utterance);
    };

    // Show a notification and read it aloud
    const showNotification = (message) => {
        notificationMessage.textContent = message;
        notificationBox.style.display = 'block';
        speakMessage(message);
    };

    // Hide notification when OK is clicked
    okBtn.addEventListener('click', () => {
        notificationBox.style.display = 'none';
        speakMessage("Notification closed.");
    });

    // Voice Recognition setup
    const startVoiceRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Web Speech API is not supported in this browser.');
            return;
        }

        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Check for transcription mode toggle commands
            if (finalTranscript.toLowerCase().includes('start answering')) {
                inTranscriptionMode = true;
                answerBox.placeholder = "Listening...";
                answerBox.value = '';
                speakMessage("You can now start answering.");
                return;
            }
            if (finalTranscript.toLowerCase().includes('stop answering')) {
                inTranscriptionMode = false;
                answerBox.placeholder = "Say 'Start Answering' to begin transcribing.";
                speakMessage("Transcription stopped.");
                return;
            }

            if (inTranscriptionMode) {
                // Fill the answer box with spoken text
                answerBox.value += finalTranscript;
            } else {
                 // Handle voice commands for navigation and actions
                const transcript = finalTranscript.toLowerCase();
                if (transcript.includes('read question')) {
                    readQuestionBtn.click();
                } else if (transcript.includes('next question')) {
                    nextBtn.click();
                } else if (transcript.includes('previous question')) {
                    prevBtn.click();
                } else if (transcript.includes('save answer')) {
                    saveBtn.click();
                } else if (transcript.includes('submit exam')) {
                    submitBtn.click();
                } else if (transcript.includes('ok')) {
                    if (notificationBox.style.display === 'block') {
                        okBtn.click();
                    }
                }
            }
        };

        recognition.onend = () => {
            if (!isSpeaking) {
                // Wait a moment before restarting to avoid errors
                setTimeout(() => {
                    recognition.start();
                }, 500); 
            }
        };
        
        recognition.start();
    };

    // Functions to handle exam navigation and actions
    const displayQuestion = (index) => {
        if (index >= 0 && index < examQuestions.length) {
            currentQuestionIndex = index;
            const question = examQuestions[currentQuestionIndex];
            questionNumber.textContent = `Question ${question.id} of ${examQuestions.length}`;
            questionText.textContent = question.text;
            answerBox.value = question.answer; 
            
            document.querySelectorAll('.question-button').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-q-id="${question.id}"]`).classList.add('active');

            inTranscriptionMode = false; // Start in command mode for new question
            answerBox.placeholder = "Say 'Start Answering' to begin transcribing.";
        }
    };
    
    const nextQuestion = () => {
        if (currentQuestionIndex < examQuestions.length - 1) {
            saveAnswer();
            displayQuestion(currentQuestionIndex + 1);
            speakMessage("Navigating to next question.");
        } else {
            speakMessage("You are on the last question.");
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            saveAnswer();
            displayQuestion(currentQuestionIndex - 1);
            speakMessage("Navigating to previous question.");
        } else {
            speakMessage("You are on the first question.");
        }
    };

    const saveAnswer = () => {
        examQuestions[currentQuestionIndex].answer = answerBox.value;
        console.log(`Answer for Q${currentQuestionIndex + 1} saved: ${answerBox.value}`);
        showNotification("Answer Saved. Your progress for this question is saved.");
    };

    const submitExam = () => {
        if (confirm("Are you sure you want to submit the exam?")) {
            speakMessage("Exam submitted successfully. Thank you for giving your exam. Results will be announced shortly.");
            
            if (proctorVideo.srcObject) {
                proctorVideo.srcObject.getTracks().forEach(track => track.stop());
            }
            if (recognition) {
                recognition.stop();
            }
            clearInterval(timerInterval);

            setTimeout(() => {
                window.location.href = 'exam_success.html';
            }, 5000);
        }
    };
    
    // Initializing dynamic question buttons
    const createQuestionButtons = () => {
        questionButtonsContainer.innerHTML = '';
        examQuestions.forEach((question, index) => {
            const button = document.createElement('button');
            button.classList.add('question-button');
            button.dataset.qId = question.id;
            button.textContent = question.id;
            button.addEventListener('click', () => displayQuestion(index));
            questionButtonsContainer.appendChild(button);
        });
    };

    // Add button click listeners
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    saveBtn.addEventListener('click', saveAnswer);
    submitBtn.addEventListener('click', submitExam);
    readQuestionBtn.addEventListener('click', () => speakMessage(questionText.textContent));
    
    // Initial setup
    createQuestionButtons();
    startProctoring();
    displayQuestion(0);
});