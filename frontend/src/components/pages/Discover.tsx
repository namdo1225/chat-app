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
import { useAuth } from "@/context/AuthProvider";
import { Session, User } from "@supabase/supabase-js";
import { useChats } from "@/hooks/useChat";
import { Chat } from "@/types/chat";

const GroupGrid = ({
    user,
    session,
    chats,
}: {
    user: User;
    session: Session;
    chats: Chat[];
}) => {
    const { fetchNextPage, hasNextPage } = useChats(session.access_token);

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
                        chat.owner_id !== user?.id && (
                            <Grid item key={chat.id}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography>{chat.name}</Typography>
                                    <Typography>{chat.description}</Typography>
                                    <Tooltip title="Join group">
                                        <IconButton
                                            onClick={() => {}}
                                            children={<PersonAddIcon />}
                                        />
                                    </Tooltip>
                                </Paper>
                            </Grid>
                        )
                )}
            </Grid>
        </InfiniteScroll>
    );
};

const Discover = () => {
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
                        session={session}
                        chats={filteredChats}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default Discover;