import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Slider,
  Typography,
  Container,
} from "@mui/material";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState("");
  const [voices, setVoices] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Fetch available voices and languages from ElevenLabs API
    const fetchOptions = async () => {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      try {
        const voiceResponse = await axios.get(
          "https://api.elevenlabs.io/v1/voices",
          {
            headers: {
              Accept: "application/json",
              "xi-api-key": "c52ce032c2c6b53610bdc2cd8cd38219",
              "Content-Type": "application/json",
            },
          }
        );
        setVoices(voiceResponse.data.voices);

        const languageResponse = await axios.get(
          "https://api.elevenlabs.io/v1/languages",
          {
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );
        setLanguages(languageResponse.data.languages);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleConvert = async () => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    try {
      const response = await axios.post(
        "https://api.elevenlabs.io/v1/text-to-speech",
        {
          text,
          voice,
          speed,
          language,
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      // Handle the response to play the audio
      const audio = new Audio(response.data.audio_url);
      audio.play();
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Text to Speech Converter
      </Typography>
      <TextField
        label="Enter text"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Select
        label="Select Voice"
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        fullWidth
      >
        {voices.map((voice) => (
          <MenuItem key={voice.id} value={voice.id}>
            {voice.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        label="Select Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        fullWidth
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
      <Typography gutterBottom>Speed</Typography>
      <Slider
        value={speed}
        min={0.5}
        max={2}
        step={0.1}
        onChange={(e, newValue) => setSpeed(newValue)}
        valueLabelDisplay="auto"
      />
      <Button variant="contained" color="primary" onClick={handleConvert}>
        Convert
      </Button>
    </Container>
  );
};

export default TextToSpeech;
