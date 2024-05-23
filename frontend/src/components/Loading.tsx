import { CircularProgress, Box, Typography } from "@mui/material";

/**
 * Wrapper for MaterialUI's loading component.
 * @param {number} props.size The size of the loading circle.
 * @param {string} props.message Message for the loading component.
 * @param {number} props.padding The padding of the loading circle.
 * @returns The React component.
 */
const Loading = ({
    size,
    message,
    padding,
}: {
    size?: number;
    message?: string;
    padding?: number;
}): JSX.Element => {
    return (
        <Box
            sx={{
                display: "flex",
                my: 10,
                flexDirection: "column",
                p: padding ?? 0,
            }}
        >
            <CircularProgress sx={{ mx: "auto" }} size={size ?? 32} />
            {message && (
                <Typography my={2} textAlign="center">
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Loading;
