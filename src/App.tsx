import React, { useState } from "react";
import * as R from "ramda";
import axios from "axios";

import { Typography, Button, Autocomplete, TextField } from "@mui/material";
import { Container, Stack } from "@mui/system";

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

const getThematifiedQuestion = (question: string, theme: string) =>
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
    if (R.isNil(value)) {
      setTheme(null);
    } else {
      setTheme(value);
    }
  };

  const bla = async () => {
    if (!theme) return;

    try {
      setThematifiedQuestions({
        fetching: true,
        error: null,
        data: "",
      });

      const questions = questionsTxt.split("\n\n");
      const questionRequests = questions.map((question) => getThematifiedQuestion(question, theme.value));

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
    <Container
      sx={{
        my: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
      maxWidth="xl"
    >
      <Typography variant="h3">Thematify your Boring Math assignments!</Typography>
      <Stack
        sx={{
          gap: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          height: "80vh",
          width: "100%",
        }}
      >
        <Stack
          sx={{
            gap: 1,
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="h5">Questions</Typography>
          <textarea
            value={questionsTxt}
            onChange={(e) => setQuestionsTxt(e.target.value)}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </Stack>

        <Stack>
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

          <Button
            onClick={bla}
            sx={{
              height: "fit-content",
            }}
          >
            Thematify the question!
          </Button>
        </Stack>

        <Stack
          sx={{
            gap: 1,
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="h5">Thematified questions</Typography>
          <textarea
            readOnly
            value={thematifiedQuestions.data}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
