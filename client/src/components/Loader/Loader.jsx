import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={60} />
    </div>
  );
};

export default Loader;