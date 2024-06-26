import { Profile } from "@/types/profile";
import { SimpleDialogProps } from "@/types/prop";
import { formatSupabaseDate } from "@/utils/date";
import { Box, Button, Dialog, DialogTitle, Typography } from "@mui/material";

interface UserProfileDialogProps extends SimpleDialogProps {
    profile: Profile;
}

/**
 * Component to check a user's profile.
 * Check {@link UserProfileDialogProps} for prop info.
 * @returns {JSX.Element} The React component.
 */
const UserProfileDialog = ({
    onClose,
    open,
    profile,
}: UserProfileDialogProps): JSX.Element => {
    return (
        <Dialog onClose={onClose} open={open}>
            <Box
                sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
                <DialogTitle textAlign="center">User Profile</DialogTitle>
                <Box
                    component="img"
                    sx={{
                        mx: "auto",
                        height: 1 / 8,
                        width: 1 / 8,
                        borderRadius: 20,
                    }}
                    alt="User profile"
                    src={profile?.profile_photo}
                />
                <Typography sx={{ fontWeight: "bold" }} textAlign="center">
                    {profile.first_name} {profile.last_name}
                </Typography>
                <Typography textAlign="center">
                    Joined the website at:{" "}
                    {formatSupabaseDate(profile.created_at)}
                </Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="info"
                    sx={{ my: 2 }}
                >
                    Return
                </Button>
            </Box>
        </Dialog>
    );
};

export default UserProfileDialog;
