import { useState } from "react";
import axios from "axios";

import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Container, Stack } from "@mui/system";
import ThemeCard from "./components/ThemeCard";
import * as styles from "./styles";

interface ThemeOption {
  label: string;
  value: string;
  imgUrl: string;
}

const themes: ThemeOption[] = [
  {
    label: "Iron Man",
    value: "iron-man",
    imgUrl:
      "https://images.unsplash.com/photo-1626278664285-f796b9ee7806?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Harry Potter",
    value: "hp1",
    imgUrl:
      "https://images.unsplash.com/photo-1598153346810-860daa814c4b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "The Adventure of the Three Gables",
    value: "ad3g",
    imgUrl: "https://i.pinimg.com/564x/96/82/cb/9682cbac938474c397648fceb9f38077.jpg",
  },
  {
    label: "Naruto",
    value: "naruto",
    imgUrl:
      "https://occ-0-2085-2164.1.nflxso.net/dnm/api/v6/X194eJsgWBDE2aQbaNdmCXGUP-Y/AAAABTvqllg5Y66HHl6EeTuzL9MGXF2w11Zd3IxhQz2O7DkQY55UaHADxO2EUYASlggL9b_9nRepZu-X5Y5MBaA9XzE1vOFE-2O_CUU.webp?r=f87",
  },
];

const validThemes = ["iron-man", "hp1", "ad3g"];

const fetchThematifiedQuestion = (question: string, theme: string) =>
  axios.get("http://localhost:8000/thematifyQuestion", {
    params: {
      question,
      theme,
    },
  });

function App() {
  const [questionsTxt, setQuestionsTxt] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [thematifiedQuestions, setThematifiedQuestions] = useState<{
    fetching: boolean;
    error: string | null;
    data: string;
  }>({
    fetching: false,
    error: null,
    data: "",
  });

  const fetchThematifiedQuestions = async () => {
    const validSelectedThemes = selectedThemes.filter((item) => validThemes.includes(item));
    if (validSelectedThemes.length === 0) return;

    try {
      setThematifiedQuestions({
        fetching: true,
        error: null,
        data: "",
      });

      const questions = questionsTxt.split("\n\n");
      const questionRequests = questions.map((question, qsnIndex) =>
        fetchThematifiedQuestion(question, validSelectedThemes[qsnIndex % validSelectedThemes.length]),
      );

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

  const handleClickTheme = (themeId: string) => {
    setSelectedThemes((prevThemes) => {
      if (prevThemes.includes(themeId)) {
        return prevThemes.filter((item) => item !== themeId);
      }

      return [...prevThemes, themeId];
    });
  };

  return (
    <Container sx={styles.container} maxWidth="xl">
      <Typography variant="h3">No more Boring Math problems!</Typography>
      <Stack
        sx={{
          gap: 1,
          maxWidth: "100%",
          overflow: "auto",
          pb: 0.5,
        }}
        className="customScrollbar"
      >
        <Typography variant="h5">Choose stuff you like</Typography>

        <Stack direction="row" gap={1}>
          {themes.map((theme) => (
            <ThemeCard
              key={theme.value}
              id={theme.value}
              title={theme.label}
              img={theme.imgUrl}
              selected={selectedThemes.includes(theme.value)}
              onClick={handleClickTheme}
            />
          ))}
        </Stack>
      </Stack>

      <Stack sx={styles.mainContent}>
        <Stack sx={styles.questionsContainer}>
          <Typography variant="h5">💤 Boring problems</Typography>
          <textarea
            value={questionsTxt}
            onChange={(e) => setQuestionsTxt(e.target.value)}
            style={styles.questionTextarea}
          />
        </Stack>

        <Stack sx={styles.actionColumn}>
          <LoadingButton
            variant="contained"
            onClick={fetchThematifiedQuestions}
            loading={thematifiedQuestions.fetching}
            sx={{
              height: "fit-content",
              textTransform: "none",
            }}
            disableElevation
          >
            Riddikulus!
          </LoadingButton>
        </Stack>

        <Stack sx={styles.questionsContainer}>
          <Typography variant="h5">🔥 Noice problems</Typography>
          <textarea readOnly value={thematifiedQuestions.data} style={styles.questionTextarea} />
        </Stack>
      </Stack>

      <Typography>Made with 🪄 by 13point5</Typography>
    </Container>
  );
}

export default App;
