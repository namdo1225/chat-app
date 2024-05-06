import { Avatar, Box, Paper, Typography } from "@mui/material";
import { HomeMsg } from "@/types/chat";

const Message = ({
    msg,
    fromUser,
}: {
    msg: HomeMsg;
    fromUser: boolean;
}) => {

    const date = new Date(Number(msg.sent_at));

    return (
        <Box>
            <Typography
                sx={{
                    display: "flex",
                    justifyContent: fromUser ? "flex-end" : "flex-start",
                }}
            >
               {msg.chatter && msg.chatter.length > 10 ? `${msg.chatter.slice(0, 10)}...` : msg.chatter }
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: fromUser ? "flex-end" : "flex-start",
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: fromUser ? "row-reverse" : "row",
                        alignItems: "center",
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: fromUser
                                ? "secondary.main"
                                : "primary.main",
                            width: 25,
                            height: 25,
                        }}
                    >
                        {msg.chatter.charAt(0)}
                    </Avatar>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 1,
                            ml: fromUser ? 0 : 1,
                            mr: fromUser ? 1 : 0,
                            backgroundColor: fromUser
                                ? "secondary.main"
                                : "info.light",
                            borderRadius: fromUser
                                ? "20px 20px 5px 20px"
                                : "20px 20px 20px 5px",
                        }}
                    >
                        <Typography>{msg.text}</Typography>
                    </Paper>
                </Box>
            </Box>
            <Typography
                sx={{
                    display: "flex",
                    justifyContent: fromUser ? "flex-end" : "flex-start",
                    fontSize: 12,
                }}
            >
               {date.toLocaleTimeString()}
            </Typography>
        </Box>
    );
};

export default Message;
