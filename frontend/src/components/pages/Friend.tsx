import {
    Box,
    Paper,
    Typography,
    TextField,
    Switch,
    Button,
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Avatar,
} from "@mui/material";
import { useProfiles } from "@/hooks/useUser";
import { useState } from "react";
import Loading from "@/components/Loading";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfiniteScroll from "react-infinite-scroll-component";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
    useAddFriend,
    useFriends,
    useRemoveFriend,
    useVerifyFriend,
} from "@/hooks/useFriend";
import { useAuth } from "@/context/AuthProvider";
import { Session, User } from "@supabase/supabase-js";
import { Friend as Friendtype } from "@/types/friend";
import { Profile } from "@/types/profile";
import UserProfileDialog from "@/components/UserProfileDialog";

const UserList = ({
    user,
    session,
    friends,
    profiles,
}: {
    user: User;
    session: Session;
    friends: Friendtype[];
    profiles: Profile[];
}) => {
    const { mutate: mutateAdd } = useAddFriend();
    const handleAddFriend = async (id: string) => {
        if (user && session) mutateAdd({ id, token: session.access_token });
    };
    const { fetchNextPage, hasNextPage } = useProfiles();
    const [openUserDialog, setOpenUserDialog] = useState(false);

    return (
        <InfiniteScroll
            dataLength={profiles.length}
            hasMore={hasNextPage}
            next={fetchNextPage}
            loader={<Loading />}
            endMessage={
                <Typography sx={{ textAlign: "center", my: 10 }}>
                    End of user list
                </Typography>
            }
            scrollThreshold={0.5}
        >
            <Table sx={{ overflow: "auto", my: 2 }} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {profiles.map(
                        (profile) =>
                            profile.user_id !== user?.id &&
                            !friends.some(
                                (f) => f.user_id === profile.user_id
                            ) && (
                                <TableRow key={profile.user_id}>
                                    <TableCell
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar
                                            onClick={() =>
                                                setOpenUserDialog(true)
                                            }
                                            alt="User Avatar"
                                            src={profile.profile_photo}
                                        />
                                        {profile.first_name} {profile.last_name}
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    {openUserDialog && (
                                        <UserProfileDialog
                                            open={openUserDialog}
                                            onClose={() =>
                                                setOpenUserDialog(false)
                                            }
                                            profile={profile}
                                        />
                                    )}
                                </TableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </InfiniteScroll>
    );
};

const FriendList = ({
    user,
    session,
    friends,
    pending,
}: {
    user: User;
    session: Session;
    friends: Friendtype[];
    pending: boolean;
}) => {
    const { mutate: mutateRemove } = useRemoveFriend();
    const { mutate: mutateVerify } = useVerifyFriend();
    const { fetchNextPage, hasNextPage } = useFriends(session.access_token);
    const [openUserDialog, setOpenUserDialog] = useState(false);

    const handleRemoveFriend = async (id: string) => {
        if (user && session) mutateRemove({ id, token: session.access_token });
    };

    const handleVerifyFriend = async (id: string) => {
        if (user && session) mutateVerify({ id, token: session.access_token });
    };

    return (
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
                            pending === profile.pending && (
                                <TableRow key={profile.user_id}>
                                    <TableCell
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar
                                            onClick={() =>
                                                setOpenUserDialog(true)
                                            }
                                            alt="User Avatar"
                                            src={profile.profile_photo}
                                        />
                                        {profile.first_name} {profile.last_name}
                                    </TableCell>
                                    <TableCell>
                                        {profile.pending &&
                                            profile.requestee === user?.id && (
                                                <Tooltip title="Accept friend request">
                                                    <IconButton
                                                        onClick={() =>
                                                            void handleVerifyFriend(
                                                                profile.id
                                                            )
                                                        }
                                                        children={
                                                            <PersonAddIcon />
                                                        }
                                                    />
                                                </Tooltip>
                                            )}
                                        <Tooltip title="Remove friend">
                                            <IconButton
                                                onClick={() =>
                                                    void handleRemoveFriend(
                                                        profile.id
                                                    )
                                                }
                                                children={<PersonRemoveIcon />}
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    {openUserDialog && (
                                        <UserProfileDialog
                                            open={openUserDialog}
                                            onClose={() =>
                                                setOpenUserDialog(false)
                                            }
                                            profile={profile}
                                        />
                                    )}
                                </TableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </InfiniteScroll>
    );
};

const Friend = () => {
    const { user, session } = useAuth();
    const [searchPublic, setSearchPublic] = useState(false);
    const [pending, setPending] = useState(false);
    const [searchStr, setSearchStr] = useState("");

    const { data: friends, isLoading: loadingFriend } = useFriends(
        session?.access_token as string
    );

    const { data: profiles, isLoading } = useProfiles(searchPublic);
    const { mutate: mutateAdd } = useAddFriend();

    const handleAddFriend = async (id: string) => {
        if (user && session) mutateAdd({ id, token: session.access_token });
    };

    if ((!profiles && searchPublic) || !friends || isLoading || loadingFriend)
        return <Loading />;

    const filteredFriends =
        searchStr && !searchPublic
            ? friends.filter(
                  (friend) =>
                      friend.first_name.includes(searchStr) ||
                      friend.last_name.includes(searchStr)
              )
            : friends;

    const filteredProfiles =
        searchStr && searchPublic && profiles
            ? profiles.filter(
                  (profile) =>
                      profile.first_name.includes(searchStr) ||
                      profile.last_name.includes(searchStr)
              )
            : profiles ?? [];

    return (
        <Box>
            <Typography textAlign="center" variant="h4" m={2}>
                Friends
            </Typography>
            <Paper sx={{ m: 2, p: 2 }}>
                <Box display="flex" flexWrap="wrap">
                    <Typography>Searching for new people?</Typography>
                    <Switch
                        checked={searchPublic}
                        onChange={() => setSearchPublic(!searchPublic)}
                    />
                </Box>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        placeholder={
                            searchPublic
                                ? "Find new friends"
                                : "Search your friend list"
                        }
                        value={searchStr}
                        onChange={({ target }) => setSearchStr(target.value)}
                    />
                    {searchPublic && (
                        <Button
                            onClick={() => void handleAddFriend(searchStr)}
                            variant="contained"
                        >
                            Add By User ID
                        </Button>
                    )}
                </Box>
                {!searchPublic && (
                    <>
                        <Box display="flex" flexWrap="wrap">
                            <Typography>Pending request:</Typography>
                            <Switch
                                checked={pending}
                                onChange={() => setPending(!pending)}
                            />
                        </Box>
                        {session && user && (
                            <FriendList
                                user={user}
                                session={session}
                                pending={pending}
                                friends={filteredFriends}
                            />
                        )}
                    </>
                )}
                {searchPublic && (
                    <>
                        <Typography>
                            Search for people to add as friends. If their
                            profile is not public, you can add them as friends
                            if you have their user ID.
                        </Typography>
                        {session && user && (
                            <UserList
                                user={user}
                                session={session}
                                profiles={filteredProfiles}
                                friends={filteredFriends}
                            />
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default Friend;
