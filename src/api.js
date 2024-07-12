import axios from "axios";

const API_KEY = "c52ce032c2c6b53610bdc2cd8cd38219";
const API_URL = "https://api.elevenlabs.io/v1";

export const getVoices = async () => {
  try {
    const response = await axios.get(`${API_URL}/voices`, {
      headers: {
        "xi-api-key": API_KEY,
      },
    });
    return response.data.voices;
  } catch (error) {
    console.error("Error fetching voices:", error);
    throw error;
  }
};

export const convertTextToSpeech = async (
  text,
  voiceId,
  speed,
  stability,
  similarityBoost
) => {
  try {
    const response = await axios.post(
      `${API_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_multilingual_v1",
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style: 0.0,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
};
