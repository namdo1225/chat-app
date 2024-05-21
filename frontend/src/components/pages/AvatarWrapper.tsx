import { Avatar } from "@mui/material";
import UserProfileDialog from "@/components/UserProfileDialog";
import { useState } from "react";
import { Profile } from "@/types/profile";

const AvatarWrapper = ({ profile }: { profile: Profile }) => {
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
