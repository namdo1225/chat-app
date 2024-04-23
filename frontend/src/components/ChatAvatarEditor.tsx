import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { forwardRef } from "react";
import AvatarEditor from "react-avatar-editor";

const ChatAvatarEditor = forwardRef<AvatarEditor, { file: File }>(
    ({ file }, ref) => {
        return (
            <>
                <Box
                    sx={{
                        mx: "auto",
                        display: { xs: "none", hcaptcha: "block" },
                    }}
                >
                    <AvatarEditor
                        className="my-3"
                        ref={ref}
                        image={file}
                        width={200}
                        height={200}
                        border={50}
                        scale={1.2}
                    />
                </Box>
                <Typography
                    color="error"
                    sx={{ display: { hcaptcha: "block", sm: "none" } }}
                >
                    * Zooming in will cause the editor to hide.
                </Typography>
            </>
        );
    }
);

export default ChatAvatarEditor;
