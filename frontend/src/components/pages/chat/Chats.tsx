import {
    Box,
    Button,
    Drawer,
    Dialog,
    DialogTitle,
    Paper,
    Typography,
    Divider,
    TextField,
    FormControlLabel,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Tooltip,
    Grid,
    Avatar,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@/context/AuthProvider";
import { useFormik } from "formik";
import { CreateChatSchema } from "@/types/chat";
import axios from "axios";
import toast from "react-hot-toast";
import { DialogProps } from "@/types/prop";
import { EditChatSchema, Chat } from "@/types/chat";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    useChats,
    useCreateChat,
    useDeleteChat,
    useEditChat,
} from "@/hooks/useChat";
import Loading from "@/components/Loading";
import { Session } from "@supabase/supabase-js";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import { useFriends } from "@/hooks/useFriend";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
    useChatMembers,
    useChatMembersProfile,
    useDeleteChatMember,
} from "@/hooks/useChatMembers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import UserProfileDialog from "@/components/UserProfileDialog";

const CreateChatDialog = ({ onClose, open, session }: DialogProps) => {
    const { mutate, isPending } = useCreateChat();
    const {
        data: friends,
        fetchNextPage,
        hasNextPage,
    } = useFriends(session.access_token);
    const [searchStr, setSearchStr] = useState("");
    const filteredFriends = searchStr
        ? friends.filter(
              (friend) =>
                  friend.first_name.includes(searchStr) ||
                  friend.last_name.includes(searchStr)
          )
        : friends;

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            public: false,
            members: [] as string[],
        },
        validationSchema: CreateChatSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            try {
                mutate({
                    chat: values,
                    token: session.access_token,
                });

                handleClose();
            } catch (e) {
                toast.error("An unknown error occured.");
                console.error(e);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    const addMember = (friendID: string) => {
        if (!formik.values.members.includes(friendID))
            formik.setFieldValue(
                "members",
                formik.values.members.concat(friendID)
            );
    };

    const removeMember = (friendID: string) => {
        if (formik.values.members.includes(friendID))
            formik.setFieldValue(
                "members",
                formik.values.members.filter((id) => id !== friendID)
            );
    };

    return (
        <Dialog disableScrollLock={true} onClose={handleClose} open={open}>
            {isPending && <Loading padding message="Creating chat..." />}
            {!isPending && (
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 500,
                        }}
                    >
                        <DialogTitle textAlign="center">
                            Create a chat:
                        </DialogTitle>
                        <TextField
                            color="secondary"
                            required
                            sx={{ my: 2 }}
                            label="Chat name"
                            type="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.name}
                            helperText={formik.errors.name}
                        />
                        <TextField
                            color="secondary"
                            sx={{ my: 2 }}
                            label="Chat description"
                            name="description"
                            value={formik.values.description}
                            multiline
                            rows={3}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.description}
                            helperText={formik.errors.description}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={formik.values.public} />
                            }
                            onChange={formik.handleChange}
                            label="Make your chat discoverable"
                            name="public"
                        />
                        <Typography>
                            Add friends (non-pending ONLY) to chat:
                        </Typography>
                        <TextField
                            placeholder="Search your friend list"
                            value={searchStr}
                            onChange={({ target }) =>
                                setSearchStr(target.value)
                            }
                        />
                        <InfiniteScroll
                            dataLength={filteredFriends.length}
                            hasMore={hasNextPage}
                            next={fetchNextPage}
                            loader={<Loading />}
                            endMessage={
                                <Typography
                                    sx={{ textAlign: "center", my: 10 }}
                                >
                                    End of friend list
                                </Typography>
                            }
                            scrollThreshold={0.5}
                            height={200}
                        >
                            <Table sx={{ overflow: "auto", m: 2 }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredFriends.map(
                                        (profile) =>
                                            !profile.pending && (
                                                <TableRow key={profile.user_id}>
                                                    <TableCell>
                                                        {`${profile.first_name} ${profile.last_name}`}
                                                    </TableCell>
                                                    {!formik.values.members.includes(
                                                        profile.user_id
                                                    ) && (
                                                        <TableCell>
                                                            <Tooltip title="Add friend to group">
                                                                <IconButton
                                                                    onClick={() =>
                                                                        addMember(
                                                                            profile.user_id
                                                                        )
                                                                    }
                                                                    children={
                                                                        <PersonAddIcon />
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </TableCell>
                                                    )}
                                                    {formik.values.members.includes(
                                                        profile.user_id
                                                    ) && (
                                                        <TableCell>
                                                            <Tooltip title="Remove friend from group">
                                                                <IconButton
                                                                    onClick={() =>
                                                                        removeMember(
                                                                            profile.user_id
                                                                        )
                                                                    }
                                                                    children={
                                                                        <PersonRemoveIcon />
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            )
                                    )}
                                </TableBody>
                            </Table>
                        </InfiniteScroll>
                        <Button
                            type="submit"
                            variant="contained"
                            color="info"
                            sx={{ my: 2 }}
                            disabled={!formik.values.name}
                        >
                            Create
                        </Button>
                        <Button
                            onClick={handleClose}
                            variant="contained"
                            color="secondary"
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            )}
        </Dialog>
    );
};

interface EditChatDialogProps extends DialogProps {
    chat: Chat;
}

const EditChatDialog = ({
    onClose,
    open,
    session,
    chat,
}: EditChatDialogProps) => {
    const {
        data: friends,
        fetchNextPage,
        hasNextPage,
    } = useFriends(session.access_token);
    const { mutate } = useDeleteChat();
    const { mutate: mutateEdit } = useEditChat();
    const { data: members, isLoading } = useChatMembers(
        chat.id,
        session.access_token
    );
    const [searchStr, setSearchStr] = useState("");
    const filteredFriends = searchStr
        ? friends.filter(
              (friend) =>
                  friend.first_name.includes(searchStr) ||
                  friend.last_name.includes(searchStr)
          )
        : friends;

    const formik = useFormik({
        initialValues: {
            name: chat.name,
            description: chat.description,
            public: chat.public,
            removeMembers: [] as string[],
            addMembers: [] as string[],
            owner_id: undefined,
        },
        validationSchema: EditChatSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                mutateEdit({
                    chatID: chat.id,
                    chat: values,
                    token: session.access_token,
                });

                handleClose();
            } catch (e) {
                if (axios.isAxiosError(e))
                    toast.error(
                        e.response?.data.error ??
                            "An unknown error occured while editing chat."
                    );
                console.error(e);
            }

            handleClose();
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    const handleDelete = async () => {
        try {
            if (window.confirm("Do you really want to delete this chat?"))
                mutate({ chatID: chat.id, token: session.access_token });
        } catch (error) {
            toast.error(
                "Error occurred while deleting chat. Was not able to delete chat."
            );
        }
        onClose();
    };

    const addMember = (friendID: string) => {
        if (formik.values.removeMembers.includes(friendID)) {
            formik.setFieldValue(
                "removeMembers",
                formik.values.removeMembers.filter((id) => id !== friendID)
            );
        } else {
            formik.setFieldValue(
                "addMembers",
                formik.values.addMembers.concat(friendID)
            );
        }
    };

    const removeMember = (friendID: string) => {
        if (formik.values.addMembers.includes(friendID)) {
            formik.setFieldValue(
                "addMembers",
                formik.values.addMembers.filter((id) => id !== friendID)
            );
        } else {
            formik.setFieldValue(
                "removeMembers",
                formik.values.removeMembers.concat(friendID)
            );
        }
    };

    const newOwner = friends.find(
        (friend) => friend.user_id === formik.values.owner_id
    );

    if (isLoading) return <Loading message="Loading chat edit" />;

    return (
        <Dialog onClose={onClose} open={open}>
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        minWidth: 500,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <DialogTitle textAlign="center">Edit chat:</DialogTitle>
                    <TextField
                        color="secondary"
                        sx={{ my: 2 }}
                        label="Chat name"
                        type="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!formik.errors.name}
                        helperText={formik.errors.name}
                    />
                    <TextField
                        color="secondary"
                        sx={{ my: 2 }}
                        label="Chat description"
                        name="description"
                        value={formik.values.description}
                        multiline
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!formik.errors.description}
                        helperText={formik.errors.description}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={formik.values.public} />}
                        onChange={formik.handleChange}
                        label="Make your chat discoverable"
                        name="public"
                    />
                    <Typography sx={{ fontWeight: "bold", my: 2 }}>
                        New chat owner:
                        {newOwner
                            ? ` ${newOwner.first_name} ${newOwner.last_name}`
                            : " None"}
                        {newOwner && (
                            <Button
                                sx={{ mx: 2 }}
                                variant="contained"
                                onClick={() =>
                                    formik.setFieldValue("owner_id", undefined)
                                }
                            >
                                Clear
                            </Button>
                        )}
                    </Typography>
                    <Typography>Edit chat members:</Typography>
                    <TextField
                        placeholder="Search your friend list"
                        value={searchStr}
                        onChange={({ target }) => setSearchStr(target.value)}
                    />
                    <InfiniteScroll
                        dataLength={filteredFriends.length}
                        hasMore={hasNextPage}
                        next={fetchNextPage}
                        loader={<Loading />}
                        endMessage={
                            <Typography sx={{ textAlign: "center", my: 10 }}>
                                End of friend list
                            </Typography>
                        }
                        scrollThreshold={0.5}
                        height={200}
                    >
                        <Table sx={{ overflow: "auto", m: 2 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredFriends.map(
                                    (profile) =>
                                        !profile.pending && (
                                            <TableRow key={profile.user_id}>
                                                <TableCell>
                                                    <Typography
                                                        color={
                                                            formik.values.addMembers.includes(
                                                                profile.user_id
                                                            )
                                                                ? "success.main"
                                                                : formik.values.removeMembers.includes(
                                                                      profile.user_id
                                                                  )
                                                                ? "error.main"
                                                                : ""
                                                        }
                                                    >{`${profile.first_name} ${profile.last_name}`}</Typography>
                                                </TableCell>
                                                <TableCell
                                                    sx={{ color: "Highlight" }}
                                                >
                                                    {!formik.values.addMembers.includes(
                                                        profile.user_id
                                                    ) &&
                                                        (formik.values.removeMembers.includes(
                                                            profile.user_id
                                                        ) ||
                                                            !members.find(
                                                                (member) =>
                                                                    member.user_id ===
                                                                    profile.user_id
                                                            )) && (
                                                            <Tooltip title="Add friend to group">
                                                                <IconButton
                                                                    onClick={() =>
                                                                        addMember(
                                                                            profile.user_id
                                                                        )
                                                                    }
                                                                    children={
                                                                        <PersonAddIcon />
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    {!formik.values.removeMembers.includes(
                                                        profile.user_id
                                                    ) &&
                                                        (formik.values.addMembers.includes(
                                                            profile.user_id
                                                        ) ||
                                                            members.find(
                                                                (member) =>
                                                                    member.user_id ===
                                                                    profile.user_id
                                                            )) && (
                                                            <Tooltip title="Remove friend from group">
                                                                <IconButton
                                                                    onClick={() =>
                                                                        removeMember(
                                                                            profile.user_id
                                                                        )
                                                                    }
                                                                    children={
                                                                        <PersonRemoveIcon />
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    {members.find(
                                                        (member) =>
                                                            member.user_id ===
                                                            profile.user_id
                                                    ) &&
                                                        formik.values
                                                            .owner_id !==
                                                            profile.user_id &&
                                                        !formik.values.removeMembers.includes(
                                                            profile.user_id
                                                        ) && (
                                                            <Tooltip title="Give chat ownership to friend">
                                                                <IconButton
                                                                    onClick={() =>
                                                                        formik.setFieldValue(
                                                                            "owner_id",
                                                                            profile.user_id
                                                                        )
                                                                    }
                                                                    children={
                                                                        <AdminPanelSettingsIcon />
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                )}
                            </TableBody>
                        </Table>
                    </InfiniteScroll>
                    <Button
                        onClick={() => formik.resetForm()}
                        variant="contained"
                        color="warning"
                        sx={{ my: 2 }}
                        endIcon={<RestartAltIcon />}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="info"
                        sx={{ my: 2 }}
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="secondary"
                        sx={{ my: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => void handleDelete()}
                        variant="contained"
                        color="error"
                        sx={{ my: 2 }}
                    >
                        Delete Chat
                    </Button>
                </Box>
            </form>
        </Dialog>
    );
};

const ChatDetailDialog = ({
    onClose,
    open,
    session,
    chat,
}: EditChatDialogProps) => {
    const { mutate, isPending } = useDeleteChatMember();

    const handleLeave = async () => {
        try {
            if (window.confirm("Do you really want to leave this chat?"))
                mutate({ chatID: chat.id, token: session.access_token });
        } catch (error) {
            toast.error(
                "Error occurred while leave chat. Was not able to leave chat."
            );
        }
        onClose();
    };

    if (isPending) return <Loading message="Loading chat details..." />;

    return (
        <Dialog onClose={onClose} open={open}>
            <Box
                sx={{
                    minWidth: 500,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Typography sx={{ fontWeight: "bold" }}>Chat name:</Typography>
                <Typography
                    sx={{
                        fontWeight: "bold",
                        border: 1,
                        borderColor: "primary.main",
                        p: 2,
                    }}
                >
                    {chat.name}
                </Typography>
                <Typography>Chat description:</Typography>
                <Typography
                    sx={{ border: 1, borderColor: "primary.main", p: 2 }}
                >
                    {chat.description ?? "None"}
                </Typography>
                <Typography>
                    This chat is: {chat.public ? "public" : "[rovate"}
                </Typography>
                <Button onClick={onClose} variant="contained" color="primary">
                    Back
                </Button>
                <Button
                    onClick={() => void handleLeave()}
                    variant="contained"
                    color="error"
                >
                    Leave Chat
                </Button>
            </Box>
        </Dialog>
    );
};

const ChatScroll = ({
    session,
    chatToMsg,
    setChatToMSg,
}: {
    session: Session;
    chatToMsg: Chat | null;
    setChatToMSg: Dispatch<SetStateAction<Chat | null>>;
}) => {
    const { user } = useAuth();
    const [openEditChat, setOpenEditChat] = useState(false);
    const [openViewChat, setOpenViewChat] = useState(false);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const {
        data: chats,
        isLoading: loadingChat,
        hasNextPage,
        fetchNextPage,
    } = useChats(session.access_token, 1, false);
    const [searchStr, setSearchStr] = useState("");
    const filteredChats = searchStr
        ? chats.filter((chat) => chat.name.includes(searchStr))
        : chats;

    if (loadingChat) return <Loading />;

    const closeDialog = () => {
        setOpenEditChat(false);
        setSelectedChat(null);
    };

    const selectEditChat = (chat: Chat) => {
        setSelectedChat(chat);
        setOpenEditChat(true);
    };

    const selectViewChat = (chat: Chat) => {
        setSelectedChat(chat);
        setOpenViewChat(true);
    };

    return (
        <>
            <TextField
                placeholder="Search your chat list"
                value={searchStr}
                onChange={({ target }) => setSearchStr(target.value)}
            />
            <InfiniteScroll
                dataLength={filteredChats.length}
                hasMore={hasNextPage}
                next={fetchNextPage}
                loader={
                    <Loading
                        size={20}
                        message="Scroll down to load more chat"
                    />
                }
                height={200}
            >
                <List dense={true}>
                    {filteredChats.map((chat) => (
                        <Tooltip
                            key={chat.id}
                            title={
                                chat.description
                                    ? chat.description.length < 50
                                        ? chat.description
                                        : `${chat.description.slice(0, 50)}...`
                                    : "Click on icon to read chat's messages"
                            }
                        >
                            <ListItem>
                                <ListItemText>
                                    <Typography
                                        color={
                                            chatToMsg &&
                                            chatToMsg.id === chat.id
                                                ? "secondary"
                                                : "primary"
                                        }
                                    >
                                        {chat.name.length < 10
                                            ? chat.name
                                            : `${chat.name.slice(0, 10)}...`}
                                    </Typography>
                                </ListItemText>
                                <IconButton
                                    sx={{ mx: 2 }}
                                    edge="start"
                                    onClick={() => setChatToMSg(chat)}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                {user?.id === chat.owner_id && (
                                    <IconButton
                                        sx={{ mx: 2 }}
                                        onClick={() => selectEditChat(chat)}
                                        edge="end"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}
                                {user?.id !== chat.owner_id && (
                                    <IconButton
                                        sx={{ mx: 2 }}
                                        onClick={() => selectViewChat(chat)}
                                        edge="end"
                                    >
                                        <ReadMoreIcon />
                                    </IconButton>
                                )}
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </InfiniteScroll>
            {session && selectedChat && (
                <EditChatDialog
                    open={openEditChat}
                    onClose={closeDialog}
                    session={session}
                    chat={selectedChat}
                />
            )}
            {session && selectedChat && (
                <ChatDetailDialog
                    open={openViewChat}
                    onClose={closeDialog}
                    session={session}
                    chat={selectedChat}
                />
            )}
        </>
    );
};

const ChattingScreen = ({
    userID,
    chat,
    token,
}: {
    userID: string;
    chat: Chat;
    token: string;
}) => {
    const [text, setText] = useState("");
    const { mutate } = useSendMessage();
    const { finalData, infinite } = useMessages(token, chat.id);

    const sendMessage = () => {
        try {
            mutate({ token, text, chatID: chat.id });
            setText("");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box>
            <Box
                id="scrollableDiv"
                height={500}
                sx={{
                    overflowY: "scroll",
                    display: "flex",
                    flexDirection: "column-reverse",
                    p: 2,
                }}
            >
                <InfiniteScroll
                    inverse
                    className="flex flex-col-reverse overflow-visible"
                    dataLength={finalData.length}
                    hasMore={infinite.hasNextPage}
                    next={infinite.fetchNextPage}
                    loader={<Loading />}
                    endMessage={
                        <Typography sx={{ textAlign: "center", my: 10 }}>
                            No older chat history.
                        </Typography>
                    }
                    scrollThreshold={0.5}
                    scrollableTarget="scrollableDiv"
                >
                    {finalData.map((msg) => (
                        <Message
                            key={msg.id}
                            msg={{ ...msg, chatter: "T" }}
                            fromUser={msg.from_user_id === userID}
                            fromServer={true}
                        />
                    ))}
                </InfiniteScroll>
            </Box>
            <Box
                sx={{
                    p: 2,
                }}
            >
                <Grid wrap="wrap" container spacing={2}>
                    <Grid item xs>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message"
                            variant="outlined"
                            value={text}
                            onChange={({ target }) => setText(target.value)}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <Button
                            color="primary"
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={sendMessage}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

const Chatroom = ({ chat, token }: { chat: Chat; token: string }) => {
    const { data: members, isLoading } = useChatMembersProfile(chat.id, token);
    const [hideMembers, setHideMembers] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const { user } = useAuth();
    const { mutate } = useDeleteChatMember();
    const deleteMember = () => {
        try {
            mutate({ chatID: chat.id, token });
        } catch (e) {
            console.error(e);
        }
    };

    if (isLoading) return <Loading message="Loading chat..." />;

    return (
        <Box>
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    m: 5,
                    p: 5,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        {chat.name}
                    </Typography>
                    <Tooltip title="Hide member list">
                        <IconButton
                            sx={{}}
                            onClick={() => setHideMembers(!hideMembers)}
                        >
                            <MenuOpenIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Paper
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {user && (
                        <Box sx={{ width: hideMembers ? 3 / 4 : 1 / 1 }}>
                            <ChattingScreen
                                userID={user.id}
                                chat={chat}
                                token={token}
                            />
                        </Box>
                    )}
                    {!hideMembers && (
                        <Box
                            sx={{
                                width: 1 / 4,
                                borderLeft: 1,
                                overflow: "auto",
                            }}
                        >
                            <List>
                                {members.map((member) => (
                                    <ListItem key={member.profiles.user_id}>
                                        <Avatar
                                            onClick={() =>
                                                setOpenUserDialog(true)
                                            }
                                            alt="User Avatar"
                                            src={member.profiles.profile_photo}
                                        />
                                        <ListItemText sx={{ mx: 2 }}>
                                            <Typography>
                                                {member.profiles.first_name}{" "}
                                                {member.profiles.last_name}
                                            </Typography>
                                        </ListItemText>
                                        {chat.owner_id === user?.id && (
                                            <Tooltip title="Remove member from chat">
                                                <IconButton
                                                    onClick={deleteMember}
                                                >
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {openUserDialog && (
                                            <UserProfileDialog
                                                open={openUserDialog}
                                                onClose={() =>
                                                    setOpenUserDialog(false)
                                                }
                                                profile={member.profiles}
                                            />
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Paper>
            </Paper>
        </Box>
    );
};

const Chats = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCreateChat, setOpenCreateChat] = useState(false);
    const [chatToMsg, setChatToMSg] = useState<Chat | null>(null);

    const { session } = useAuth();

    return (
        <Box>
            <Typography textAlign="center" variant="h4" m={2}>
                Chats
            </Typography>
            <IconButton
                sx={{ position: "absolute", top: 65, left: 2 }}
                onClick={() => setOpenDrawer(true)}
            >
                <MenuOpenIcon />
            </IconButton>
            <Drawer
                disableScrollLock={true}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                sx={{
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                    },
                }}
                anchor="left"
            >
                <Box
                    my={10}
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {session && (
                        <>
                            <Typography>Chats</Typography>
                            <ChatScroll
                                chatToMsg={chatToMsg}
                                setChatToMSg={setChatToMSg}
                                session={session}
                            />
                            <Divider />
                            <Button
                                onClick={() => setOpenCreateChat(true)}
                                endIcon={<AddIcon />}
                            >
                                Create a chat
                            </Button>
                        </>
                    )}
                    <Button
                        onClick={() => setOpenDrawer(false)}
                        endIcon={<ExitToAppIcon />}
                    >
                        Hide bar
                    </Button>
                </Box>
            </Drawer>
            {!chatToMsg ? (
                <Paper
                    sx={{
                        m: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Button
                        sx={{ m: 2 }}
                        variant="contained"
                        onClick={() => setOpenDrawer(true)}
                    >
                        Open sidebar
                    </Button>
                    <Typography textAlign="center">
                        Open the sidebar to select a chat
                    </Typography>
                </Paper>
            ) : (
                <>
                    {session && (
                        <Chatroom
                            chat={chatToMsg}
                            token={session.access_token}
                        />
                    )}
                </>
            )}
            {session && (
                <CreateChatDialog
                    open={openCreateChat}
                    onClose={() => setOpenCreateChat(false)}
                    session={session}
                />
            )}
        </Box>
    );
};

export default Chats;
