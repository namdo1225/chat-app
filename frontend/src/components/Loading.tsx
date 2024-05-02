import { CircularProgress, Box } from "@mui/material";

const Loading = () => {
    return (
        <Box sx={{ display: "flex", my: 10 }}>
            <CircularProgress sx={{ mx: "auto" }} />
        </Box>
    );
};

export default Loading;
