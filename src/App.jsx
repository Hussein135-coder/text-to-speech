import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { convertTextToSpeech, getVoices } from "./api";

function App() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [voices, setVoices] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.5);
  const [language, setLanguage] = useState("en");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const voicesData = await getVoices();
        setVoices(voicesData);
        if (voicesData.length > 0) {
          setVoice(voicesData[0].voice_id);
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };
    fetchVoices();
  }, []);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const url = await convertTextToSpeech(
        text,
        voice,
        speed,
        stability,
        similarityBoost
      );
      setAudioUrl(url);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while converting text to speech.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" align="center" gutterBottom>
        Text to Speech Converter
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Enter text to convert"
        value={text}
        onChange={(e) => setText(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Voice</InputLabel>
        <Select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          label="Voice"
        >
          {voices.map((v) => (
            <MenuItem key={v.voice_id} value={v.voice_id}>
              {v.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>Speech Speed</Typography>
        <Slider
          value={speed}
          onChange={(e, newValue) => setSpeed(newValue)}
          min={0.5}
          max={2}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>Stability</Typography>
        <Slider
          value={stability}
          onChange={(e, newValue) => setStability(newValue)}
          min={0}
          max={1}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>Similarity Boost</Typography>
        <Slider
          value={similarityBoost}
          onChange={(e, newValue) => setSimilarityBoost(newValue)}
          min={0}
          max={1}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Language</InputLabel>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          label="Language"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="ar">Arabic</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleConvert}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Convert to Speech"}
      </Button>
      {audioUrl && (
        <Box sx={{ mt: 2 }}>
          <audio controls src={audioUrl} style={{ width: "100%" }}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
    </Container>
  );
}

export default App;
