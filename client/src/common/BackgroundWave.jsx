import { styled } from "@mui/material/styles";
import { ReactComponent as IconWave } from "../images/newwave.svg";

const BackgroundWave = styled(IconWave)({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  zIndex: -1,
});

export default BackgroundWave;
