import { Avatar } from "@mui/material";
import UserProfileDialog from "@/components/UserProfileDialog";
import { useState } from "react";
import { Profile } from "@/types/profile";

/**
 * Component to add functionality to the avatar component.
 * @returns {JSX.Element} The React component.
 */
const AvatarWrapper = ({ profile }: { profile: Profile }): JSX.Element => {
    const [openUserDialog, setOpenUserDialog] = useState(false);

    return (
        <>
            <Avatar
                onClick={() => setOpenUserDialog(true)}
                alt="User Avatar"
                src={profile.profile_photo}
            />
            {openUserDialog && (
                <UserProfileDialog
                    open={openUserDialog}
                    onClose={() => setOpenUserDialog(false)}
                    profile={profile}
                />
            )}
        </>
    );
};

export default AvatarWrapper;
