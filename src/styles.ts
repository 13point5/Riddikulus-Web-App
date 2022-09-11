import { SxProps } from "@mui/system/styleFunctionSx/index";

type Styles = SxProps;

export const container: Styles = {
  my: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
};

export const mainContent: Styles = {
  gap: 5,
  flexDirection: "row",
  justifyContent: "space-between",
  height: "400px",
  width: "100%",
};

export const questionsContainer: Styles = {
  gap: 1,
  alignItems: "center",
  height: "100%",
  width: "100%",
};

export const questionTextarea = {
  height: "100%",
  width: "100%",
  padding: "1rem",
  borderRadius: "0.5rem",
};

export const actionColumn: Styles = {
  height: "100%",
  justifyContent: "center",
  gap: 2,
};
