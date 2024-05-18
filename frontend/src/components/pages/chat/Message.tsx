import {
    Avatar,
    Box,
    Button,
    Dialog,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { FrontendMsg } from "@/types/message";
import * as y from "yup";
import { useDeleteMessage, useEditMessage } from "@/hooks/useMessages";
import { useAuth } from "@/context/AuthProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Loading from "@/components/Loading";
import { DialogProps } from "@/types/prop";
import { useState } from "react";
import { Profile } from "@/types/profile";
import { parseSupabaseDate } from "@/utils/date";

interface EditMessageDialogProps extends DialogProps {
    msg: FrontendMsg;
}

const EditMessageDialog = ({
    onClose,
    open,
    session,
    msg,
}: EditMessageDialogProps) => {
    const { mutate, isPending } = useEditMessage();
    const [text, setText] = useState(msg.text);
    if (isPending) return;

    const handleEdit = () => {
        try {
            mutate({ token: session.access_token, msgID: msg.id, text });
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog onClose={onClose} open={open}>
            {isPending && <Loading message="Processing request..." />}
            {!isPending && (
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        width: 300,
                    }}
                >
                    <Typography textAlign="center">
                        Edit your message
                    </Typography>
                    <TextField
                        value={text}
                        multiline
                        rows={3}
                        onChange={({ target }) => setText(target.value)}
                    />
                    <Button
                        disabled={msg.text === text}
                        color="primary"
                        variant="contained"
                        onClick={handleEdit}
                    >
                        Confirm
                    </Button>
                    <Button onClick={onClose} color="error" variant="contained">
                        Cancel
                    </Button>
                </Box>
            )}
        </Dialog>
    );
};

const Message = ({
    msg,
    fromUser,
    fromServer = false,
    profile = null,
}: {
    msg: FrontendMsg;
    fromUser: boolean;
    fromServer?: boolean;
    profile?: Profile | null;
}) => {
    const { mutate: mutateDelete } = useDeleteMessage();
    const { session, user } = useAuth();
    const [openEditMessage, setOpenEditMessage] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const { chatTheme } = useAuth();

    const validDate = y.string().datetime().isValidSync(msg.sent_at);

    const date = new Date(
        validDate
            ? msg.sent_at
            : !fromServer
            ? JSON.parse(msg.sent_at)
            : parseSupabaseDate(msg.sent_at)
    );

    const handleDeleteMsg = (token: string) => {
        try {
            mutateDelete({ token, msgID: msg.id });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box
            onMouseOver={() => setShowIcon(true)}
            onMouseOut={() => setShowIcon(false)}
        >
            <Typography
                sx={{
                    display: "flex",
                    justifyContent: fromUser ? "flex-end" : "flex-start",
                }}
            >
                {msg.chatter && msg.chatter.length > 10
                    ? `${msg.chatter.slice(0, 10)}...`
                    : msg.chatter}
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
                                ? chatTheme.fromMessageBox
                                : chatTheme.toMessageBox,
                            width: 25,
                            height: 25,
                        }}
                        src={profile ? profile.profile_photo : undefined}
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
                                ? chatTheme.fromMessageBox
                                : chatTheme.toMessageBox,
                            borderRadius: fromUser
                                ? "20px 20px 5px 20px"
                                : "20px 20px 20px 5px",
                        }}
                    >
                        <Typography
                            color={
                                fromUser
                                    ? chatTheme.fromMessageText
                                    : chatTheme.toMessageText
                            }
                        >
                            {msg.text}
                        </Typography>
                    </Paper>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: fromUser ? "flex-end" : "flex-start",
                    fontSize: 12,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 12,
                    }}
                >
                    {date.toLocaleTimeString()}
                </Typography>
                {showIcon &&
                    session &&
                    fromServer &&
                    user &&
                    user.id === msg.from_user_id && (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <IconButton
                                    onClick={() =>
                                        handleDeleteMsg(session.access_token)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => setOpenEditMessage(true)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Box>
                            <EditMessageDialog
                                open={openEditMessage}
                                onClose={() => setOpenEditMessage(false)}
                                session={session}
                                msg={msg}
                            />
                        </>
                    )}
            </Box>
        </Box>
    );
};

export default Message;
