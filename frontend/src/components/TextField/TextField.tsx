import { TextField as MuiTextField, TextFieldProps } from "@mui/material";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <MuiTextField
      {...props}
      slotProps={{ select: { IconComponent: ArrowDownIcon } }}
    />
  );
};

export default TextField;
