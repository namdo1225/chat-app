import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Grid,
} from "@mui/material";
import { useState } from "react";
import { useProfiles } from "@/hooks/useUser";
import Loading from "@/components/Loading";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "@supabase/supabase-js";
import { useChats } from "@/hooks/useChat";
import { Chat } from "@/types/chat";
import { useJoinChatMember } from "@/hooks/useChatMembers";
import useAuth from "@/context/useAuth";

/**
 * Component to view all public chats in a grid.
 * @param {User} props.user The user's info.
 * @param {string} props.token The user's supabase access token.
 * @param {Chat[]} props.chats The chats info for the grid.
 * @returns {JSX.Element} The React component.
 */
const GroupGrid = ({
    user,
    token,
    chats,
}: {
    user: User;
    token: string;
    chats: Chat[];
}): JSX.Element => {
    const { fetchNextPage, hasNextPage } = useChats(token);
    const { mutate, isPending } = useJoinChatMember();

    return (
        <InfiniteScroll
            dataLength={chats.length}
            hasMore={hasNextPage}
            next={fetchNextPage}
            loader={<Loading />}
            endMessage={
                <Typography sx={{ textAlign: "center", my: 10 }}>
                    End of group list
                </Typography>
            }
            scrollThreshold={0.5}
        >
            <Grid container p={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {chats.map(
                    (chat) =>
                        chat.owner_id !== user.id && (
                            <Grid item key={chat.id} sx={{ my: 2 }}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography
                                        sx={{ fontWeight: "bold" }}
                                        noWrap
                                        textAlign="center"
                                    >
                                        {chat.name.length < 10
                                            ? chat.name
                                            : `${chat.name.slice(0, 10)}...`}
                                    </Typography>
                                    {chat.description && (
                                        <Typography noWrap textAlign="center">
                                            {chat.description.length < 50
                                                ? chat.description
                                                : `${chat.description.slice(
                                                    0,
                                                    50
                                                )}...`}
                                        </Typography>
                                    )}
                                    {!isPending && (
                                        <Tooltip title="Join group">
                                            <IconButton
                                                onClick={() =>
                                                    mutate({
                                                        chatID: chat.id,
                                                        token,
                                                    })
                                                }
                                                children={<PersonAddIcon />}
                                            />
                                        </Tooltip>
                                    )}
                                </Paper>
                            </Grid>
                        )
                )}
            </Grid>
        </InfiniteScroll>
    );
};

/**
 * Component for /discover page that contains info about public chats.
 * @returns {JSX.Element} The React component.
 */
const Discover = (): JSX.Element => {
    const { user, session } = useAuth();
    const [searchStr, setSearchStr] = useState("");

    const { data: chats, isLoading: loadingChat } = useChats(
        session?.access_token as string
    );

    const { data: profiles, isLoading } = useProfiles(true);

    if (!profiles || !chats || isLoading || loadingChat) return <Loading />;

    const filteredChats = searchStr
        ? chats.filter((chat) => chat.name.includes(searchStr))
        : chats;

    return (
        <Box>
            <Typography textAlign="center" variant="h4" m={2}>
                Discover Chat Groups
            </Typography>
            <Paper sx={{ m: 2, p: 2 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        placeholder="Search for a chat group"
                        value={searchStr}
                        onChange={({ target }) => setSearchStr(target.value)}
                    />
                </Box>
                {user && session && filteredChats && (
                    <GroupGrid
                        user={user}
                        token={session.access_token}
                        chats={filteredChats}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default Discover;
