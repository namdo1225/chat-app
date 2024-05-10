import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = ({ size, message }: { size?: number; message?: string }) => {
    return (
        <Box sx={{ display: "flex", my: 10, flexDirection: "column" }}>
            <CircularProgress sx={{ mx: "auto" }} size={size ?? 32} />
            {message && <Typography my={2} textAlign="center">{message}</Typography>}
        </Box>
    );
};

export default Loading;
