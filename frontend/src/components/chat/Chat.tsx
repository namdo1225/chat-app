import { Box, Button, Grid, List, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";
import { HomeMsg, HomeMsgSchema } from "@/types/chat";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { v4 as uuidv4 } from 'uuid';

/**
 * Code from: https://frontendshape.com/post/create-a-chat-ui-in-react-with-mui-5
 */
const Chat = ({ chatter }: { chatter: string }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<HomeMsg[]>([]);
    const [socketUrl, setSocketUrl] = useState("ws://localhost:8080/homechat");
    const [shouldConnect, setShouldConnect] = useState(true);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, undefined, shouldConnect);
    const [connected, setConnected] = useState(false);

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    useEffect(() => {
        setConnected(!!readyState);
    }, [readyState]);

    useEffect(() => {
        const recvMsg = async () => {
            if (lastMessage) {
                const msg = await HomeMsgSchema.validate(JSON.parse(lastMessage.data));
                setMessages(
                    messages.concat(msg).slice(0, 300)
                );
            }
        }

        void recvMsg();
    }, [lastMessage]);

    const handleClickSendMessage = () => {
        if (input.trim() !== "") {
            const msg = {
                id: uuidv4(),
                text: input,
                sent_at: new Date().getTime().toString(),
                chatter,
            }

            sendMessage(JSON.stringify(msg));
            setMessages(
                messages.concat(msg)
            );
        }
        setInput("");
    };

    return (
        <>
            <Box
                sx={{
                    display: { xs: "none", hcaptcha: "block" },
                    m: 2,
                }}
            >
                <Box>
                    <Typography sx={{ textAlign: "center" }}>
                        Your connection is: {connectionStatus}
                    </Typography>
                    <Typography sx={{ textAlign: "center" }}>
                        Chatting as {chatter}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        p: 1,
                        height: 1 / 2,
                        width: 3 / 4,
                        mx: "auto",
                        my: 2,
                        maxHeight: 300,
                        overflow: "auto",
                    }}
                >
                    <List sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                        {messages.map((message) => (
                            <Message
                                key={message.id}
                                msg={message}
                                fromUser={message.chatter === chatter}
                            />
                        ))}
                    </List>
                </Box>
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: "background.default",
                        width: 3 / 4,
                        mx: "auto",
                    }}
                >
                    <Grid wrap="wrap" container spacing={2}>
                        <Grid item xs>
                            <TextField
                                disabled={!shouldConnect || !connected}
                                fullWidth
                                size="small"
                                placeholder="Type a message"
                                variant="outlined"
                                value={input}
                                onChange={({ target }) =>
                                    setInput(target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs="auto">
                            <Button
                                disabled={!shouldConnect || !connected}
                                color="primary"
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={handleClickSendMessage}
                            >
                                Send
                            </Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button
                                color={shouldConnect ? "error" : "primary"}
                                variant="contained"
                                onClick={() => setShouldConnect(!shouldConnect)}
                            >
                                {shouldConnect ? "Leave" : "Join"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Typography
                color="error"
                sx={{ display: { hcaptcha: "block", sm: "none" } }}
            >
                * Zooming in will cause the chat to hide.
            </Typography>
        </>
    );
};

export default Chat;
