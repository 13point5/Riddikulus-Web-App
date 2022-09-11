import React from "react";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { Add as AddIcon, CheckCircle as DoneIcon } from "@mui/icons-material";

interface Props {
  id: string;
  title: string;
  img: string;
  selected: boolean;
  onClick: (id: string) => void;
}

export default function ThemeCard({ id, title, img, selected, onClick }: Props) {
  const handleClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onClick(id);
  };

  return (
    <ImageListItem
      sx={{
        width: "400px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <img
        alt="theme"
        src={img}
        style={{
          width: "400px",
          height: "200px",
        }}
      />
      <ImageListItemBar
        title={title}
        actionIcon={
          <IconButton onClick={handleClick} sx={{ color: "white" }}>
            {selected ? <DoneIcon /> : <AddIcon />}
          </IconButton>
        }
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      />
    </ImageListItem>
  );
}
