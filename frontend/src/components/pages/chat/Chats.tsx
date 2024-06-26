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
    Menu,
} from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import { useFormik } from "formik";
import { CreateChatSchema } from "@/types/chat";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthDialogProps } from "@/types/prop";
import { EditChatSchema, Chat } from "@/types/chat";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    useChats,
    useCreateChat,
    useDeleteChat,
    useEditChat,
} from "@/hooks/useChat";
import Loading from "@/components/Loading";
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
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import ChatMsgWrapper from "./ChatMsgWrapper";
import SearchIcon from "@mui/icons-material/Search";
import AvatarWrapper from "../AvatarWrapper";
import { differentDays, formatSupabaseDate } from "@/utils/date";
import DescriptionIcon from "@mui/icons-material/Description";
import { ChatMember } from "@/types/chat_members";
import useAuth from "@/context/useAuth";
import tweetnacl, { BoxKeyPair } from "tweetnacl";
import HttpsIcon from "@mui/icons-material/Https";
import { useEncryptionKey } from "@/hooks/useMessages";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

/**
 * Component to create a chat in a dialog.
 * Check {@link AuthDialogProps} for prop info.
 * @returns {JSX.Element} The React component.
 */
const CreateChatDialog = ({
    onClose,
    open,
    token,
}: AuthDialogProps): JSX.Element => {
    const { mutate, isPending } = useCreateChat();
    const { data: friends, infiniteFriends } = useFriends(token);
    const [searchStr, setSearchStr] = useState("");
    const filteredFriends = searchStr
        ? friends.filter(
              (friend) =>
                  friend.first_name.includes(searchStr) ||
                  friend.last_name.includes(searchStr)
          )
        : friends;
    const [keyPair, setKeyPair] = useState<BoxKeyPair>(tweetnacl.box.keyPair());
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            public: false,
            members: [] as string[],
            encrypted: false,
            public_key: null,
        },
        validationSchema: CreateChatSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            try {
                mutate({
                    chat: values,
                    token,
                });

                handleClose();
            } catch (e) {
                toast.error("An unknown error occured.");
                console.error(e);
            }
        },
    });

    const handleClose = (): void => {
        formik.resetForm();
        onClose();
    };

    const addMember = (friendID: string): void => {
        if (!formik.values.members.includes(friendID))
            formik.setFieldValue(
                "members",
                formik.values.members.concat(friendID)
            );
    };

    const removeMember = (friendID: string): void => {
        if (formik.values.members.includes(friendID))
            formik.setFieldValue(
                "members",
                formik.values.members.filter((id) => id !== friendID)
            );
    };

    const handleDiscover = (
        event: React.SyntheticEvent<Element, Event>,
        checked: boolean
    ): void => {
        if (checked) {
            formik.setFieldValue("encrypted", false);
            formik.setFieldValue("public_key", null);
        }
        formik.handleChange(event);
    };

    const handleEncryptChange = (
        event: React.SyntheticEvent<Element, Event>,
        checked: boolean
    ): void => {
        if (checked) {
            const pair = tweetnacl.box.keyPair();
            setKeyPair(pair);
            formik.setFieldValue("public_key", pair.publicKey.toString());
        } else {
            formik.setFieldValue("public_key", null);
        }
        formik.handleChange(event);
    };

    return (
        <Dialog disableScrollLock={true} onClose={handleClose} open={open}>
            {isPending ? (
                <Loading padding={5} message="Creating chat..." />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 500,
                            gap: 2,
                        }}
                    >
                        <DialogTitle fontWeight="bold" textAlign="center">
                            Create Chat
                        </DialogTitle>
                        <TextField
                            data-cy="chat-create-name"
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
                            onChange={handleDiscover}
                            label="Make your chat discoverable."
                            name="public"
                        />
                        <FormControlLabel
                            disabled={!!formik.values.public}
                            control={
                                <Checkbox checked={formik.values.encrypted} />
                            }
                            onChange={handleEncryptChange}
                            label="Encrypt your chat (Available for private chats. You can't change this option once chat is created)."
                            name="encrypted"
                        />
                        {formik.values.encrypted && (
                            <>
                                <Typography>
                                    Save this private key and share with your
                                    friends so they have access to this group
                                    chat's messages. If anyone loses it, they
                                    will lose access to the chat's history:
                                </Typography>
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        m: 2,
                                        border: 2,
                                        p: 1,
                                        backgroundColor: "primary.main",
                                        overflow: "auto",
                                    }}
                                >
                                    {keyPair.secretKey.toString()}
                                </Typography>
                            </>
                        )}
                        <Typography fontWeight="bold" textAlign="center">
                            Add friends to chat:
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
                            hasMore={infiniteFriends.hasNextPage}
                            next={infiniteFriends.fetchNextPage}
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
                                    {filteredFriends.map((profile) => {
                                        const isMember =
                                            formik.values.members.includes(
                                                profile.user_id
                                            );

                                        return (
                                            <TableRow key={profile.user_id}>
                                                <TableCell
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <AvatarWrapper
                                                        profile={profile}
                                                    />
                                                    {`${profile.first_name} ${profile.last_name}`}
                                                </TableCell>
                                                {!isMember ? (
                                                    <TableCell>
                                                        <Tooltip title="Add friend to group">
                                                            <IconButton
                                                                data-cy="chat-create-add-fri"
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
                                                ) : (
                                                    <TableCell>
                                                        <Tooltip title="Remove friend from group">
                                                            <IconButton
                                                                data-cy="chat-create-remove-fri"
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
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </InfiniteScroll>
                        <Button
                            type="submit"
                            data-cy="chat-create-submit"
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

/**
 * Interface for edit chat dialog props.
 * Check {@link AuthDialogProps} for more prop info.
 */
interface ChatDialogProps extends AuthDialogProps {
    chat: Chat;
    chatMembers?: ChatMember[];
}

/**
 * Component to edit a chat in a dialog.
 * Check {@link ChatDialogProps} for prop info.
 * @returns {JSX.Element} The React component.
 */
const EditChatDialog = ({
    onClose,
    open,
    token,
    chat,
    chatMembers,
}: ChatDialogProps): JSX.Element => {
    const { data: friends, infiniteFriends } = useFriends(token);
    const { mutate } = useDeleteChat();
    const { mutate: mutateEdit } = useEditChat();
    const { data: members, isLoading } = useChatMembers(
        chat.id,
        token,
        !!chatMembers
    );
    const [searchStr, setSearchStr] = useState("");
    const filteredFriends = searchStr
        ? friends.filter(
              (friend) =>
                  friend.first_name.includes(searchStr) ||
                  friend.last_name.includes(searchStr)
          )
        : friends;

    const finalMembers = chatMembers ?? members ?? [];

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
        onSubmit: (values) => {
            try {
                mutateEdit({
                    chatID: chat.id,
                    chat: values,
                    token,
                });

                handleClose();
            } catch (e) {
                if (axios.isAxiosError(e))
                    toast.error("An unknown error occured while editing chat.");
                console.error(e);
            }

            handleClose();
        },
    });

    const handleClose = (): void => {
        formik.resetForm();
        onClose();
    };

    const handleDelete = (): void => {
        try {
            if (window.confirm("Do you really want to delete this chat?"))
                mutate({ chatID: chat.id, token });
        } catch (error) {
            toast.error(
                "Error occurred while deleting chat. Was not able to delete chat."
            );
        }
        onClose();
    };

    const addMember = (friendID: string): void => {
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

    const removeMember = (friendID: string): void => {
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
                        disabled={chat.encrypted}
                        control={<Checkbox checked={formik.values.public} />}
                        onChange={formik.handleChange}
                        label="Make your chat discoverable"
                        name="public"
                    />
                    {chat.encrypted && (
                        <Typography color="error.main">
                            Encrypted chats cannot be made public
                        </Typography>
                    )}
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
                        hasMore={infiniteFriends.hasNextPage}
                        next={infiniteFriends.fetchNextPage}
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
                                {filteredFriends.map((profile) => {
                                    const foundMember = finalMembers.find(
                                        (member) =>
                                            member.user_id === profile.user_id
                                    );
                                    const inRemove =
                                        formik.values.removeMembers.includes(
                                            profile.user_id
                                        );
                                    const inAdd =
                                        formik.values.addMembers.includes(
                                            profile.user_id
                                        );

                                    if (profile.pending) return null;
                                    return (
                                        <TableRow key={profile.user_id}>
                                            <TableCell
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 2,
                                                }}
                                            >
                                                <AvatarWrapper
                                                    profile={profile}
                                                />
                                                <Typography
                                                    color={
                                                        inAdd
                                                            ? "success.main"
                                                            : inRemove
                                                            ? "error.main"
                                                            : ""
                                                    }
                                                >
                                                    {`${profile.first_name} ${profile.last_name}`}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={{ color: "Highlight" }}
                                            >
                                                {!inAdd &&
                                                    (inRemove ||
                                                        !foundMember) && (
                                                        <Tooltip title="Add friend to group">
                                                            <IconButton
                                                                data-cy="chat-edit-fri-add"
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
                                                {!inRemove &&
                                                    (inAdd || foundMember) && (
                                                        <Tooltip title="Remove friend from group">
                                                            <IconButton
                                                                data-cy="chat-edit-fri-remove"
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
                                                {foundMember &&
                                                    formik.values.owner_id !==
                                                        profile.user_id &&
                                                    !inRemove && (
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
                                    );
                                })}
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
                        data-cy="chat-edit-submit"
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
                        data-cy="chat-edit-fri-del"
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

/**
 * Component to view a chat's details in a dialog.
 * Check {@link ChatDialogProps} for prop info.
 * @returns {JSX.Element} The React component.
 */
const ChatDetailDialog = ({
    onClose,
    open,
    token,
    chat,
}: ChatDialogProps): JSX.Element => {
    const { mutate, isPending } = useDeleteChatMember();

    const handleLeave = (): void => {
        try {
            if (window.confirm("Do you really want to leave this chat?"))
                mutate({ chatID: chat.id, token });
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
                    This chat is: {chat.public ? "public" : "private"} and
                    {`${chat.encrypted ? "" : " not"} encrypted.`}
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

/**
 * Component to view all of a user's chats and
 * actions that can be performed on them.
 * @param {string} props.token The user's supabase access token.
 * @param {Chat} props.chatToMsg The chat currently selected.
 * @param {Dispatch<SetStateAction<Chat | null>>} props.setChatToMSg
 * Setter for selected chat.
 * @param {() => void} props.setCloseScroll The chat currently selected.
 * @returns {JSX.Element} The React component.
 */
const ChatScroll = ({
    token,
    chatToMsg,
    setChatToMSg,
    setCloseScroll,
}: {
    token: string;
    chatToMsg: Chat | null;
    setChatToMSg: Dispatch<SetStateAction<Chat | null>>;
    setCloseScroll: () => void;
}): JSX.Element => {
    const { user } = useAuth();
    const [openEditChat, setOpenEditChat] = useState(false);
    const [openViewChat, setOpenViewChat] = useState(false);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const { data: chats, infiniteChats } = useChats(token, 1, false);
    const [searchStr, setSearchStr] = useState("");
    const filteredChats = searchStr
        ? chats.filter((chat) => chat.name.includes(searchStr))
        : chats;

    if (infiniteChats.isLoading) return <Loading />;

    const closeDialog = (): void => {
        setOpenEditChat(false);
        setSelectedChat(null);
    };

    const selectEditChat = (chat: Chat): void => {
        setSelectedChat(chat);
        setOpenEditChat(true);
    };

    const selectViewChat = (chat: Chat): void => {
        setSelectedChat(chat);
        setOpenViewChat(true);
    };
    const canSelect = !!selectedChat && !!user;

    const handleSelectChat = (chat: Chat): void => {
        setChatToMSg(chat);
        setCloseScroll();
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
                hasMore={infiniteChats.hasNextPage}
                next={infiniteChats.fetchNextPage}
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
                                    : "Click on the eye icon to read chat's messages"
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
                                        sx={{
                                            fontWeight:
                                                chatToMsg &&
                                                chatToMsg.id === chat.id
                                                    ? "bold"
                                                    : "unset",
                                        }}
                                    >
                                        {chat.name.length < 10
                                            ? chat.name
                                            : `${chat.name.slice(0, 10)}...`}
                                    </Typography>
                                </ListItemText>
                                <IconButton
                                    sx={{ mx: 2 }}
                                    edge="start"
                                    onClick={() => handleSelectChat(chat)}
                                    data-cy="scroll-select"
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    sx={{ mx: 2 }}
                                    data-cy="scroll-leave"
                                    onClick={() =>
                                        user?.id === chat.owner_id
                                            ? selectEditChat(chat)
                                            : selectViewChat(chat)
                                    }
                                    edge="end"
                                >
                                    {user?.id === chat.owner_id ? (
                                        <EditIcon />
                                    ) : (
                                        <ReadMoreIcon />
                                    )}
                                </IconButton>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </InfiniteScroll>
            {canSelect && user.id === selectedChat.owner_id && (
                <EditChatDialog
                    open={openEditChat}
                    onClose={closeDialog}
                    token={token}
                    chat={selectedChat}
                />
            )}
            {canSelect && user.id !== selectedChat.owner_id && (
                <ChatDetailDialog
                    open={openViewChat}
                    onClose={closeDialog}
                    token={token}
                    chat={selectedChat}
                />
            )}
        </>
    );
};

/**
 * Component containing the actual chat portion, messages, and messaging UIs.
 * @param {string} props.userID The user's ID.
 * @param {Chat} props.chat The chat currently selected.
 * @param {string} props.token The user's supabase access token.
 * @param {string} props.searchStr The search string to filter messages content.
 * Setter for selected chat.
 * @returns {JSX.Element} The React component.
 */
const ChattingScreen = ({
    userID,
    chat,
    token,
    searchStr,
}: {
    userID: string;
    chat: Chat;
    token: string;
    searchStr: string;
}): JSX.Element => {
    const [emojiOpen, setEmojiOpen] = useState(false);
    const anchorEmoji = useRef<HTMLButtonElement>(null);
    const anchorInput = useRef<HTMLInputElement>(null);
    const [text, setText] = useState("");
    const { mutate } = useSendMessage();
    const { privateKey, publicKey } = useEncryptionKey(chat);
    const { finalData, infiniteMessages } = useMessages(
        token,
        chat,
        10,
        publicKey,
        privateKey
    );
    const { data: members, isLoading } = useChatMembersProfile(chat.id, token);
    const { profile, themeMode } = useAuth();

    const filteredMsgs = searchStr
        ? finalData.filter((msg) => msg.text.includes(searchStr))
        : finalData;

    const sendMessage = (): void => {
        try {
            mutate({ token, text, chat, publicKey, privateKey });
            setText("");
        } catch (e) {
            console.error(e);
        }
    };

    const handleEmojiPick = (
        emoji: EmojiClickData,
        _event: MouseEvent
    ): void => {
        if (anchorInput.current) {
            const cursor = anchorInput.current.selectionStart ?? 0;
            const tmpText = text
                ? text.slice(0, cursor) + emoji.emoji + text.slice(cursor)
                : emoji.emoji;
            setText(tmpText);
        }
    };

    if (isLoading || !members) return <Loading />;

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
                    dataLength={filteredMsgs.length}
                    hasMore={infiniteMessages.hasNextPage}
                    next={infiniteMessages.fetchNextPage}
                    loader={<Loading />}
                    endMessage={
                        <Typography
                            sx={{
                                textAlign: "center",
                                my: 10,
                                fontWeight: "bold",
                            }}
                        >
                            No older chat history.
                        </Typography>
                    }
                    scrollThreshold={0.5}
                    scrollableTarget="scrollableDiv"
                >
                    {filteredMsgs.map((msg, index) => (
                        <Fragment key={msg.id}>
                            {index !== 0 &&
                                differentDays(
                                    filteredMsgs[index - 1].sent_at,
                                    msg.sent_at
                                ) && (
                                    <>
                                        <Typography
                                            sx={{ fontWeight: "bold" }}
                                            textAlign="center"
                                        >
                                            {`Viewing messages for ${formatSupabaseDate(
                                                msg.sent_at
                                            )}`}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                    </>
                                )}
                            <ChatMsgWrapper
                                msg={msg}
                                foundMember={members.find(
                                    (member) =>
                                        member.profiles.user_id ===
                                        msg.from_user_id
                                )}
                                userID={userID}
                                userProfile={profile}
                                chat={chat}
                                publicKey={publicKey}
                                privateKey={privateKey}
                            />
                        </Fragment>
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
                            data-cy="chatting-textfield"
                            inputRef={anchorInput}
                            fullWidth
                            multiline
                            maxRows={4}
                            size="small"
                            placeholder="Type a message"
                            variant="outlined"
                            value={text}
                            onChange={({ target }) => setText(target.value)}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <Tooltip title="Emoji selector">
                            <IconButton
                                ref={anchorEmoji}
                                aria-label="emoji bar"
                                aria-controls="emoji-bar"
                                aria-haspopup="true"
                                onClick={() => setEmojiOpen(!emojiOpen)}
                            >
                                <EmojiEmotionsIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs="auto">
                        <Button
                            data-cy="chatting-submit"
                            disabled={
                                !text.trim() || (chat.encrypted && !privateKey)
                            }
                            color="primary"
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={sendMessage}
                        >
                            Send
                        </Button>
                    </Grid>
                    {anchorEmoji.current && (
                        <Menu
                            open={emojiOpen}
                            onClose={() => setEmojiOpen(false)}
                            disableScrollLock={true}
                            id="emoji-bar"
                            anchorEl={() =>
                                anchorEmoji.current as HTMLButtonElement
                            }
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                        >
                            <EmojiPicker
                                theme={
                                    themeMode === "light"
                                        ? Theme.LIGHT
                                        : Theme.DARK
                                }
                                open={emojiOpen}
                                onEmojiClick={handleEmojiPick}
                            />
                        </Menu>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

/**
 * Component containing the chatroom and all standard chatroom UIs.
 * @param {Chat} props.chat The chat currently selected.
 * @param {string} props.token The user's supabase access token.
 * @returns {JSX.Element} The React component.
 */
const Chatroom = ({
    chat,
    token,
}: {
    chat: Chat;
    token: string;
}): JSX.Element => {
    const { session } = useAuth();
    const { data: members, isLoading } = useChatMembersProfile(chat.id, token);
    const [hideMembers, setHideMembers] = useState(false);
    const [hideSearch, setHideSearch] = useState(true);
    const [hideViewChat, setHideViewChat] = useState(true);
    const [hideEncrypt, setHideEncrypt] = useState(true);
    const [tmpKey, setTmpKey] = useState("");
    const [searchStr, setSearchStr] = useState("");
    const { user } = useAuth();
    const { mutate } = useEditChat();
    const { setNewKey, deleteKey, privateKey } = useEncryptionKey(chat);

    const deleteMember = (userID: string): void => {
        try {
            mutate({
                chatID: chat.id,
                chat: { addMembers: [], removeMembers: [userID] },
                token,
            });
        } catch (e) {
            console.error(e);
        }
    };

    if (isLoading || !members) return <Loading message="Loading chat..." />;
    const handleSetKey = (): void => {
        setNewKey(tmpKey);
        setTmpKey("");
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    m: 5,
                    p: 5,
                }}
            >
                <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
                    {chat.name}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip
                        title={`${hideSearch ? "Show" : "Hide"} search bar`}
                    >
                        <IconButton
                            sx={{}}
                            onClick={() => setHideSearch(!hideSearch)}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Show chat's description">
                        <IconButton
                            sx={{}}
                            onClick={() => setHideViewChat(!hideViewChat)}
                        >
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Hide member list">
                        <IconButton
                            sx={{}}
                            onClick={() => setHideMembers(!hideMembers)}
                        >
                            <MenuOpenIcon />
                        </IconButton>
                    </Tooltip>
                    {chat.encrypted && (
                        <Tooltip title="Show encryption options">
                            <IconButton
                                sx={{}}
                                onClick={() => setHideEncrypt(!hideEncrypt)}
                            >
                                <HttpsIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                {!hideEncrypt && chat.encrypted && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            m: 2,
                        }}
                    >
                        <Typography>
                            Are you seeing encrypted messages? If so, set your
                            private key here to decrypt them. If it is correct,
                            the messages should be readable. If you no longer
                            have access to the key, you cannot retrieve past
                            messages.
                        </Typography>
                        <TextField
                            onChange={({ target }) => setTmpKey(target.value)}
                            placeholder="Enter private key"
                            value={tmpKey}
                        />
                        <Button onClick={handleSetKey} variant="contained">
                            Set private key
                        </Button>
                        <Button
                            onClick={deleteKey}
                            variant="contained"
                            color="error"
                        >
                            Remove private key from browser
                        </Button>
                    </Box>
                )}
                {session &&
                    (chat.owner_id === user?.id ? (
                        <EditChatDialog
                            open={!hideViewChat}
                            onClose={() => setHideViewChat(true)}
                            token={session.access_token}
                            chat={chat}
                            chatMembers={members.map((member) => {
                                return {
                                    ...member,
                                    user_id: member.profiles.user_id,
                                };
                            })}
                        />
                    ) : (
                        <ChatDetailDialog
                            open={!hideViewChat}
                            onClose={() => setHideViewChat(true)}
                            token={session.access_token}
                            chat={chat}
                        />
                    ))}
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column-reverse", md: "row" },
                        justifyContent: "center",
                    }}
                >
                    {user && (
                        <Box
                            sx={{
                                width: { md: hideMembers ? 1 / 1 : 2 / 3 },
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {!hideSearch && (
                                <TextField
                                    value={searchStr}
                                    placeholder="Search for a message"
                                    onChange={({ target }) =>
                                        setSearchStr(target.value)
                                    }
                                />
                            )}
                            <ChattingScreen
                                userID={user.id}
                                chat={chat}
                                token={token}
                                searchStr={searchStr}
                            />
                        </Box>
                    )}
                    {!hideMembers && (
                        <Box
                            sx={{
                                width: { md: 1 / 3 },
                                borderLeft: { xs: 0, md: 1 },
                                borderBottom: { xs: 1, md: 0 },
                                height: { xs: 300, md: "unset" },
                                overflow: "auto",
                            }}
                        >
                            <List>
                                {members.map((member) => (
                                    <ListItem
                                        sx={{ display: "flex", gap: 5 }}
                                        key={member.profiles.user_id}
                                    >
                                        <AvatarWrapper
                                            profile={member.profiles}
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
                                                    onClick={() =>
                                                        deleteMember(
                                                            member.profiles
                                                                .user_id
                                                        )
                                                    }
                                                >
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Paper>
            </Box>
            {chat.encrypted && !privateKey && (
                <Typography textAlign="center" color="error" m={2}>
                    * Messages for encrypted chats cannot be sent or retrieved
                    until you have set a private key.
                </Typography>
            )}
        </Box>
    );
};

/**
 * Component containing the main page for /chats.
 * @returns {JSX.Element} The React component.
 */
const Chats = (): JSX.Element => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCreateChat, setOpenCreateChat] = useState(false);
    const [chatToMsg, setChatToMSg] = useState<Chat | null>(null);

    const { session } = useAuth();

    if (!session) return <Loading />;

    return (
        <Box>
            <Typography
                sx={{ fontSize: { xs: 12, hcaptcha: 36 } }}
                textAlign="center"
                variant="h4"
                m={2}
            >
                Chats
            </Typography>
            <Tooltip title="Toggle chat sidebar">
                <IconButton
                    data-cy="chat-sidebar"
                    sx={{ position: "fixed", top: { xs: 50, sm: 75 }, left: 2 }}
                    onClick={() => setOpenDrawer(true)}
                >
                    <MenuOpenIcon />
                </IconButton>
            </Tooltip>
            <Drawer
                disableScrollLock={true}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                sx={{
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
                        width: { xs: 90, hcaptcha: "unset" },
                    }}
                >
                    <Typography>Chats</Typography>
                    <ChatScroll
                        chatToMsg={chatToMsg}
                        setChatToMSg={setChatToMSg}
                        token={session.access_token}
                        setCloseScroll={() => setOpenDrawer(false)}
                    />
                    <Divider />
                    <Button
                        onClick={() => setOpenCreateChat(true)}
                        endIcon={<AddIcon />}
                    >
                        Create a chat
                    </Button>
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
                <Chatroom chat={chatToMsg} token={session.access_token} />
            )}
            {openCreateChat && (
                <CreateChatDialog
                    open={openCreateChat}
                    onClose={() => setOpenCreateChat(false)}
                    token={session.access_token}
                />
            )}
        </Box>
    );
};

export default Chats;
