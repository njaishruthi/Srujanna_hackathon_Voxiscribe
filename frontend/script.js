document.addEventListener('DOMContentLoaded', () => {
    // API base (placeholder)
    const API_BASE_URL = 'http://localhost:3000';

    // Common elements (some may be null depending on page)
    const el = {
        // Forms by role
        studentLoginForm: document.getElementById('student-login-form'),
        studentRegisterForm: document.getElementById('student-register-form'),
        adminLoginForm: document.getElementById('admin-login-form'),
        adminRegisterForm: document.getElementById('admin-register-form'),
        // Containers (fallback to closest .auth-form if specific container id missing)
        loginFormContainer: document.getElementById('login-form-container') || (document.querySelector('#admin-login-form') ? document.querySelector('#admin-login-form').closest('.auth-form') : null),
        registerFormContainer: document.getElementById('register-form-container') || (document.querySelector('#admin-register-form') ? document.querySelector('#admin-register-form').closest('.auth-form') : null),
        // Biometric shared UI
        biometricDiv: document.getElementById('biometric-verification'),
        biometricButton: document.getElementById('biometric-button'),
        biometricHeader: document.getElementById('biometric-header') || document.querySelector('#biometric-verification h3'),
        biometricText: document.getElementById('biometric-text') || document.getElementById('verification-text'),
        webcamStream: document.getElementById('webcam-stream'),
        audioPlayback: document.getElementById('audio-playback'),
        // Admin-login specific buttons (existing markup)
        adminFaceBtn: document.getElementById('start-face-btn'),
        adminVoiceBtn: document.getElementById('start-voice-btn'),
    };

    // Determine role and mode (login/register)
    let role = null, mode = null;
    if (el.studentRegisterForm) { role = 'student'; mode = 'register'; }
    else if (el.studentLoginForm) { role = 'student'; mode = 'login'; }
    else if (el.adminRegisterForm) { role = 'admin'; mode = 'register'; }
    else if (el.adminLoginForm) { role = 'admin'; mode = 'login'; }

    let mediaRecorder;
    let audioChunks = [];
    let isFaceVerified = false;

    // Start webcam+mic if video UI exists
    const startWebcam = async () => {
        try {
            if (!el.webcamStream) return; // admin_login has placeholder (no video)
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            el.webcamStream.srcObject = stream;
        } catch (error) {
            console.error('Error accessing webcam and microphone:', error);
            alert('Could not access your camera or microphone. Please ensure permissions are granted.');
        }
    };

    // Complete authentication/registration and redirect accordingly
    const completeAuth = () => {
        setTimeout(() => {
            if (mode === 'register') {
                window.location.href = role === 'student' ? 'student_login.html' : 'admin_login.html';
            } else {
                window.location.href = role === 'student' ? 'student_dashboard.html' : 'admin_dashboard.html';
            }
        }, 1500);
    };

    // Start mic recording tied to webcam stream (student-style pages)
    const startVoiceRecord = () => {
        const stream = el.webcamStream ? el.webcamStream.srcObject : null;
        if (!stream) {
            // Fallback: simulate
            completeAuth();
            return;
        }
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = event => { audioChunks.push(event.data); };
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            if (el.audioPlayback) {
                const audioUrl = URL.createObjectURL(audioBlob);
                el.audioPlayback.src = audioUrl;
                el.audioPlayback.style.display = 'block';
            }
            completeAuth();
        };
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 4000);
    };

    // Unified biometric flow for student-style pages
    const handleBiometricFlow = async () => {
        if (!isFaceVerified) {
            if (el.biometricButton) {
                el.biometricButton.textContent = 'Verifying Face...';
                el.biometricButton.disabled = true;
            }
            await startWebcam();
            setTimeout(() => {
                isFaceVerified = true;
                if (el.biometricHeader) el.biometricHeader.textContent = 'Voice Verification';
                if (el.biometricText) el.biometricText.textContent = `Please speak a phrase for ${mode === 'register' ? 'registration' : 'verification'}`;
                if (el.biometricButton) {
                    el.biometricButton.textContent = `Start Voice ${mode === 'register' ? 'Capture' : 'Verification'}`;
                    el.biometricButton.disabled = false;
                }
            }, 2000);
        } else {
            if (el.biometricButton) {
                el.biometricButton.textContent = 'Recording in progress...';
                el.biometricButton.disabled = true;
            }
            startVoiceRecord();
        }
    };

    // STUDENT REGISTER FLOW
    if (el.studentRegisterForm) {
        el.studentRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: send registration data to backend via fetch
            if (el.registerFormContainer && el.biometricDiv) {
                el.registerFormContainer.style.display = 'none';
                el.biometricDiv.style.display = 'block';
                startWebcam();
            } else {
                completeAuth();
            }
        });
    }

    // STUDENT LOGIN FLOW
    if (el.studentLoginForm) {
        el.studentLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: verify credentials with backend
            const credentialsVerified = true;
            if (credentialsVerified) {
                if (el.loginFormContainer && el.biometricDiv) {
                    el.loginFormContainer.style.display = 'none';
                    el.biometricDiv.style.display = 'block';
                    startWebcam();
                } else {
                    completeAuth();
                }
            } else {
                alert('Invalid email or password.');
            }
        });
    }

    // ADMIN REGISTER FLOW
    if (el.adminRegisterForm) {
        el.adminRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: send registration data to backend via fetch
            alert('Admin registration complete! Please log in.');
            window.location.href = 'admin_login.html';
        });
    }

    // ADMIN LOGIN FLOW
    if (el.adminLoginForm) {
        el.adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // TODO: verify credentials with backend
            const credentialsVerified = true;
            if (!credentialsVerified) {
                alert('Invalid email or password.');
                return;
            }

            // Prefer student-style biometric UI if present
            if (el.biometricDiv && (el.biometricButton || el.webcamStream)) {
                if (el.loginFormContainer) el.loginFormContainer.style.display = 'none';
                el.biometricDiv.style.display = 'block';
                startWebcam();
                // Button-based flow (same as student)
            } else if (el.adminFaceBtn && el.adminVoiceBtn && el.biometricDiv) {
                // Fallback to admin page's two-button flow
                const container = document.querySelector('#admin-login-form') ? document.querySelector('#admin-login-form').closest('.auth-form') : null;
                if (container) container.style.display = 'none';
                el.biometricDiv.style.display = 'block';
                el.adminFaceBtn.style.display = 'inline-block';
                el.adminVoiceBtn.style.display = 'none';

                el.adminFaceBtn.onclick = () => {
                    el.adminFaceBtn.disabled = true;
                    el.adminFaceBtn.textContent = 'Verifying...';
                    setTimeout(() => {
                        el.adminFaceBtn.style.display = 'none';
                        el.adminVoiceBtn.style.display = 'inline-block';
                    }, 1500);
                };
                el.adminVoiceBtn.onclick = () => {
                    el.adminVoiceBtn.disabled = true;
                    el.adminVoiceBtn.textContent = 'Verifying...';
                    setTimeout(() => {
                        window.location.href = 'admin_dashboard.html';
                    }, 1500);
                };
            } else {
                // No biometric UI available; redirect directly
                window.location.href = 'admin_dashboard.html';
            }
        });
    }

    // Attach common biometric handler for student-style pages
    if (el.biometricButton) {
        el.biometricButton.addEventListener('click', handleBiometricFlow);
    }
});
