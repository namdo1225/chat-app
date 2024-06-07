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
import { User } from "@supabase/supabase-js";
import { Friend as Friendtype } from "@/types/friend";
import { Profile } from "@/types/profile";
import UserProfileDialog from "@/components/UserProfileDialog";
import useAuth from "@/context/useAuth";

/**
 * Component to list public users in a table.
 * @param {User} props.user The logged-in user's information.
 * @param {string} props.token The user's supabase access token.
 * @param {Friendtype[]} props.friends Friends' data.
 * @param {Profile[]} props.friends Profiles' data for reference with friends.
 * @returns {JSX.Element} The React component.
 */
const UserList = ({
    user,
    token,
    friends,
    profiles,
}: {
    user: User;
    token: string;
    friends: Friendtype[];
    profiles: Profile[];
}): JSX.Element => {
    const { mutate: mutateAdd } = useAddFriend();
    const handleAddFriend = (id: string): void => {
        mutateAdd({ id, token });
    };
    const { infiniteProfiles } = useProfiles();
    const [openUserDialog, setOpenUserDialog] = useState(false);

    return (
        <InfiniteScroll
            dataLength={profiles.length}
            hasMore={infiniteProfiles.hasNextPage}
            next={infiniteProfiles.fetchNextPage}
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
                                                data-cy="fri-send"
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

/**
 * Component to list friends in a table.
 * @param {User} props.user The logged-in user's information.
 * @param {string} props.token The user's supabase access token.
 * @param {Friendtype[]} props.friends Friends' data.
 * @param {boolean} props.pneding Whether to check pending friend requests.
 * @returns {JSX.Element} The React component.
 */
const FriendList = ({
    user,
    token,
    friends,
    pending,
}: {
    user: User;
    token: string;
    friends: Friendtype[];
    pending: boolean;
}): JSX.Element => {
    const { mutate: mutateRemove } = useRemoveFriend();
    const { mutate: mutateVerify } = useVerifyFriend();
    const { infiniteFriends } = useFriends(token);
    const [openUserDialog, setOpenUserDialog] = useState(false);

    const handleRemoveFriend = (id: string): void => {
        mutateRemove({ id, token });
    };

    const handleVerifyFriend = (id: string): void => {
        mutateVerify({ id, token });
    };

    return (
        <InfiniteScroll
            dataLength={friends.length}
            hasMore={infiniteFriends.hasNextPage}
            next={infiniteFriends.fetchNextPage}
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
                                                        data-cy="fri-accept"
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
                                                data-cy="fri-remove"
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

/**
 * Component for /friend page to show list of friends
 * and modify friendship status.
 * @returns {JSX.Element} The React component.
 */
const Friend = (): JSX.Element => {
    const { user, session } = useAuth();
    const [searchPublic, setSearchPublic] = useState(false);
    const [pending, setPending] = useState(false);
    const [searchStr, setSearchStr] = useState("");

    const { data: friends, infiniteFriends } = useFriends(
        session?.access_token as string
    );

    const { data: profiles, infiniteProfiles } = useProfiles(searchPublic);
    const { mutate: mutateAdd } = useAddFriend();

    const handleAddFriend = (id: string): void => {
        if (user && session) mutateAdd({ id, token: session.access_token });
    };

    if (
        (!profiles && searchPublic) ||
        !friends ||
        infiniteProfiles.isLoading ||
        infiniteFriends.isLoading
    )
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
                        data-cy="fri-search"
                        checked={searchPublic}
                        onChange={() => setSearchPublic(!searchPublic)}
                    />
                </Box>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        data-cy="fri-textfield"
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
                {!searchPublic ? (
                    <>
                        <Box display="flex" flexWrap="wrap">
                            <Typography>Pending request:</Typography>
                            <Switch
                                data-cy="fri-pending"
                                checked={pending}
                                onChange={() => setPending(!pending)}
                            />
                        </Box>
                        {session && user && (
                            <FriendList
                                user={user}
                                token={session.access_token}
                                pending={pending}
                                friends={filteredFriends}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <Typography>
                            Search for people to add as friends. If their
                            profile is not public, you can add them as friends
                            if you have their user ID.
                        </Typography>
                        {session && user && (
                            <UserList
                                user={user}
                                token={session.access_token}
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
