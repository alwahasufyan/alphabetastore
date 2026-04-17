import Typography from "@mui/material/Typography";
export default function ProductDescription({
  description
}) {
  return <div>
      <Typography variant="h3" sx={{
      mb: 2
    }}>
        Description
      </Typography>

      <Typography variant="body1" color="text.secondary">
        {description || "No description available."}
      </Typography>
    </div>;
}