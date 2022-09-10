import React, { useState } from "react";
import axios from "axios";

import { Typography, Autocomplete, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Container, Stack } from "@mui/system";
import * as styles from "./styles";

interface ThemeOption {
  label: string;
  value: string;
}

const themes: ThemeOption[] = [
  {
    label: "Iron Man",
    value: "iron-man",
  },
  {
    label: "Harry Potter",
    value: "hp1",
  },
  {
    label: "The Adventure of the Three Gables",
    value: "ad3g",
  },
];

const fetchThematifiedQuestion = (question: string, theme: string) =>
  axios.get("http://localhost:8000/thematifyQuestion", {
    params: {
      question,
      theme,
    },
  });

function App() {
  const [questionsTxt, setQuestionsTxt] = useState("");
  const [theme, setTheme] = useState<ThemeOption | null>(themes[0]);
  const [thematifiedQuestions, setThematifiedQuestions] = useState<{
    fetching: boolean;
    error: string | null;
    data: string;
  }>({
    fetching: false,
    error: null,
    data: "",
  });

  const handleThemeChange = (e: React.SyntheticEvent, value: ThemeOption | null) => {
    if (!value) {
      setTheme(null);
    } else {
      setTheme(value);
    }
  };

  const fetchThematifiedQuestions = async () => {
    if (!theme) return;

    try {
      setThematifiedQuestions({
        fetching: true,
        error: null,
        data: "",
      });

      const questions = questionsTxt.split("\n\n");
      const questionRequests = questions.map((question) => fetchThematifiedQuestion(question, theme.value));

      const results = await Promise.all(questionRequests);
      const thematifiedQuestions = results.map((result) => result.data.result);
      const thematifiedAssignment = thematifiedQuestions.join("\n\n");

      setThematifiedQuestions({
        fetching: false,
        error: null,
        data: thematifiedAssignment,
      });
    } catch (error) {
      console.error(error);
      setThematifiedQuestions({
        fetching: false,
        error: "Something went wrong",
        data: "",
      });
    }
  };

  return (
    <Container sx={styles.container} maxWidth="xl">
      <Typography variant="h3">Thematify your Boring Math assignments!</Typography>
      <Stack sx={styles.mainContent}>
        <Stack sx={styles.questionsContainer}>
          <Typography variant="h5">Questions</Typography>
          <textarea
            value={questionsTxt}
            onChange={(e) => setQuestionsTxt(e.target.value)}
            style={styles.questionTextarea}
          />
        </Stack>

        <Stack sx={styles.actionColumn}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={themes}
            getOptionLabel={(option) => option.label}
            value={theme}
            onChange={handleThemeChange}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Theme" />}
          />

          <LoadingButton
            variant="contained"
            onClick={fetchThematifiedQuestions}
            loading={thematifiedQuestions.fetching}
            sx={{
              height: "fit-content",
            }}
            disableElevation
          >
            Thematify the question!
          </LoadingButton>
        </Stack>

        <Stack sx={styles.questionsContainer}>
          <Typography variant="h5">Thematified questions</Typography>
          <textarea readOnly value={thematifiedQuestions.data} style={styles.questionTextarea} />
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
