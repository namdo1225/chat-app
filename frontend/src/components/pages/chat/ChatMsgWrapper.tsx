import { ChatMsg } from "@/types/message";
import Message from "./Message";
import { ChatMemberProfile } from "@/types/chat_members";
import { Profile } from "@/types/profile";

const ChatMsgWrapper = ({
    msg,
    foundMember,
    userID,
    userProfile,
}: {
    msg: ChatMsg;
    foundMember?: ChatMemberProfile | undefined;
    userID: string;
    userProfile?: Profile | null | undefined;
}) => {
    return (
        <>
            <Message
                profile={
                    msg.from_user_id === userID
                        ? userProfile
                        : foundMember?.profiles
                }
                msg={{
                    ...msg,
                    chatter:
                        msg.from_user_id === userID
                            ? userProfile
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : "Unknown"
                            : foundMember
                            ? `${foundMember.profiles.first_name} ${foundMember.profiles.last_name}`
                            : "Unknown",
                }}
                fromUser={msg.from_user_id === userID}
            />
        </>
    );
};

export default ChatMsgWrapper;
