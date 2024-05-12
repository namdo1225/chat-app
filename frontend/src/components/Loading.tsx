import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = ({ size, message, padding }: { size?: number; message?: string; padding?: boolean }) => {
    return (
        <Box sx={{ display: "flex", my: 10, flexDirection: "column", p: padding ? 5 : 0 }}>
            <CircularProgress sx={{ mx: "auto" }} size={size ?? 32} />
            {message && <Typography my={2} textAlign="center">{message}</Typography>}
        </Box>
    );
};

export default Loading;
