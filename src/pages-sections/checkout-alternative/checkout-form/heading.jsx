import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";


// AVATAR STYLES
const STYLES = {
  width: 27,
  height: 27,
  color: "white",
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 500,
  borderRadius: 2,
  backgroundColor: "primary.main"
};


// ==============================================================


// ==============================================================

export default function Heading({
  number,
  title,
  ...props
}) {
  return <FlexBox gap={1.5} alignItems="center" mb={3.5} {...props}>
      <Avatar variant="rounded" alt={title} sx={STYLES}>
        {number}
      </Avatar>

      <Typography variant="h4">{title}</Typography>
    </FlexBox>;
}