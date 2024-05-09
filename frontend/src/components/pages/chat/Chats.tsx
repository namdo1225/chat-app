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
} from "@mui/material";
import { useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@/context/AuthProvider";
import { useFormik } from "formik";
import { CreateChatSchema } from "@/types/chat";
import { editChat } from "@/services/chat";
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

const CreateChatDialog = ({ onClose, open, session }: DialogProps) => {
    const { mutate } = useCreateChat();
    const {
        data: friends,
        fetchNextPage,
        hasNextPage,
    } = useFriends(session.access_token);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            public: false,
            members: [] as string[],
        },
        validationSchema: CreateChatSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                mutate({
                    chat: values,
                    token: session.access_token,
                });
                toast.success("Chat created successfully.");
                handleClose();
            } catch (e) {
                if (axios.isAxiosError(e))
                    toast.error(
                        e.response?.data.error ?? "An unknown error occured."
                    );
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
        <Dialog disableScrollLock={true} onClose={onClose} open={open}>
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
                    <DialogTitle textAlign="center">Create a chat:</DialogTitle>
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
                        control={<Checkbox checked={formik.values.public} />}
                        onChange={formik.handleChange}
                        label="Make your chat discoverable"
                        name="public"
                    />
                    <Typography>
                        Add friends (non-pending ONLY) to chat:
                    </Typography>
                    <InfiniteScroll
                        dataLength={friends.length}
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
                                {friends.map(
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
                        color="info"
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
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
    const { mutate, isSuccess } = useDeleteChat();
    const { mutate: mutateEdit, isSuccess: isEditSuccess } = useEditChat();

    const formik = useFormik({
        initialValues: {
            name: chat.name,
            description: chat.description,
            public: chat.public,
            removeMembers: [] as string[],
            addMembers: [] as string[],
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

                if (isEditSuccess) toast.success("Chat edited successfully.");
            } catch (e) {
                if (axios.isAxiosError(e))
                    toast.error(
                        e.response?.data.error ??
                            "An unknown error occured while editing chat."
                    );
                console.error(e);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    const handleDelete = async () => {
        try {
            mutate({ chatID: chat.id, token: session.access_token });
            if (isSuccess) toast.success("Chat deleted successfully.");
        } catch (error) {
            toast.error(
                "Error occurred while deleting chat. Was not able to delete chat."
            );
        }
        onClose();
    };

    const addMember = (friendID: string) => {
        if (!formik.values.addMembers.includes(friendID))
            formik.setFieldValue(
                "addMembers",
                formik.values.addMembers.concat(friendID)
            );
    };

    const removeMember = (friendID: string) => {
        if (formik.values.removeMembers.includes(friendID))
            formik.setFieldValue(
                "removeMembers",
                formik.values.removeMembers.filter((id) => id !== friendID)
            );
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
                <DialogTitle textAlign="center">Create a chat:</DialogTitle>
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
                <Typography>Edit chat members:</Typography>
                <InfiniteScroll
                    dataLength={friends.length}
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
                            {friends.map(
                                (profile) =>
                                    !profile.pending && (
                                        <TableRow key={profile.user_id}>
                                            <TableCell>
                                                {`${profile.first_name} ${profile.last_name}`}
                                            </TableCell>
                                            {!formik.values.addMembers.includes(
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
                                            {formik.values.removeMembers.includes(
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
                    onClick={handleClose}
                    variant="contained"
                    color="info"
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
        </Dialog>
    );
};

const ChatScroll = ({ session }: { session: Session }) => {
    const [openEditChat, setOpenEditChat] = useState(false);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const {
        data: chats,
        isLoading: loadingChat,
        hasNextPage,
        fetchNextPage,
    } = useChats(session.access_token, 1, false);

    if (loadingChat) return <Loading />;

    const closeDialog = () => {
        setOpenEditChat(false);
        setSelectedChat(null);
    };

    const selectDeleteChat = (chat: Chat) => {
        setSelectedChat(chat);
        setOpenEditChat(true);
    };

    return (
        <>
            <InfiniteScroll
                dataLength={chats.length}
                hasMore={hasNextPage}
                next={fetchNextPage}
                loader={<Loading />}
                height={200}
            >
                <List dense={true}>
                    {chats.map((chat) => (
                        <ListItem key={chat.id}>
                            <ListItemText primary={chat.name} />
                            <IconButton sx={{ mx: 2 }} edge="end">
                                <ReadMoreIcon />
                            </IconButton>
                            <IconButton
                                sx={{ mx: 2 }}
                                onClick={() => selectDeleteChat(chat)}
                                edge="end"
                            >
                                <EditIcon />
                            </IconButton>
                        </ListItem>
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
        </>
    );
};

const Chats = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCreateChat, setOpenCreateChat] = useState(false);
    const { session } = useAuth();

    return (
        <Box>
            <Drawer
                disableScrollLock={true}
                open={openDrawer}
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
                            <Typography>Your chats</Typography>
                            <ChatScroll session={session} />
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
            <Paper sx={{ m: 2 }}>
                <Button onClick={() => setOpenDrawer(true)}>Open drawer</Button>
                <Typography>Open the sidebar to select a chat</Typography>
            </Paper>
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
