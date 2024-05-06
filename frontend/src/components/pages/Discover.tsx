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
import { useAddFriend, useFriends } from "@/hooks/useFriend";
import { useAuth } from "@/context/AuthProvider";
import { Session, User } from "@supabase/supabase-js";
import { Friend as Friendtype } from "@/types/friend";
import { Profile } from "@/types/profile";

const GroupGrid = ({
    user,
    session,
    friends,
    profiles,
}: {
    user: User | undefined | null;
    session: Session | null | undefined;
    friends: Friendtype[];
    profiles: Profile[];
}) => {
    const { mutate: mutateAdd } = useAddFriend();
    const handleAddFriend = async (id: string) => {
        if (user && session) mutateAdd({ id, token: session.access_token });
    };
    const { fetchNextPage, hasNextPage } = useProfiles();

    return (
        <InfiniteScroll
            dataLength={profiles.length}
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
                {profiles.map(
                    (profile) =>
                        profile.user_id !== user?.id &&
                        !friends.some((f) => f.user_id === profile.user_id) && (
                            <Grid item key={profile.user_id}>
                                <Box>
                                    {profile.first_name} {profile.last_name}
                                </Box>
                                <Box>
                                    <Tooltip title="Send friend request">
                                        <IconButton
                                            onClick={() =>
                                                void handleAddFriend(
                                                    profile.user_id
                                                )
                                            }
                                            children={<PersonAddIcon />}
                                        />
                                    </Tooltip>
                                </Box>
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

    const { data: friends, isLoading: loadingFriend } = useFriends(
        session?.access_token as string
    );

    const { data: profiles, isLoading } = useProfiles(true);

    if (!profiles || !friends || isLoading || loadingFriend || !friends)
        return <Loading />;

    const filteredFriends = searchStr
        ? friends.filter(
              (friend) =>
                  friend.first_name.includes(searchStr) ||
                  friend.last_name.includes(searchStr)
          )
        : friends;

    const filteredProfiles =
        searchStr && profiles
            ? profiles.filter(
                  (profile) =>
                      profile.first_name.includes(searchStr) ||
                      profile.last_name.includes(searchStr)
              )
            : profiles ?? [];

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
                <GroupGrid
                    user={user}
                    session={session}
                    profiles={filteredProfiles}
                    friends={filteredFriends}
                />
            </Paper>
        </Box>
    );
};

export default Discover;
