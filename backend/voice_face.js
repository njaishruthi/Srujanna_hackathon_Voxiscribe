// utils/voice_face.js
const axios = require("axios");

// ================== SPEECH TO TEXT ==================
async function speechToText(audioBuffer) {
  try {
    const response = await axios.post(
      `https://${process.env.AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`,
      audioBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
          "Content-Type": "audio/wav"
        }
      }
    );
    return response.data.DisplayText;
  } catch (err) {
    console.error("❌ Speech-to-Text error:", err.message);
    return null;
  }
}

// ================== FACE REGISTRATION ==================
async function registerFace(imageBuffer) {
  try {
    const response = await axios.post(
      `${process.env.AZURE_FACE_ENDPOINT}/face/v1.0/detect?returnFaceId=true`,
      imageBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_FACE_KEY,
          "Content-Type": "application/octet-stream"
        }
      }
    );

    // Return the first detected faceId
    return response.data[0]?.faceId || null;
  } catch (err) {
    console.error("❌ Face Registration error:", err.message);
    return null;
  }
}

// ================== FACE VERIFICATION ==================
async function verifyFace(faceId1, faceId2) {
  try {
    const response = await axios.post(
      `${process.env.AZURE_FACE_ENDPOINT}/face/v1.0/verify`,
      { faceId1, faceId2 },
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_FACE_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.isIdentical;
  } catch (err) {
    console.error("❌ Face Verification error:", err.message);
    return false;
  }
}

module.exports = { speechToText, registerFace, verifyFace };
