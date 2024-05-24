import { ChatMsg } from "@/types/message";
import Message from "./Message";
import { ChatMemberProfile } from "@/types/chat_members";
import { Profile } from "@/types/profile";

/**
 * Component to view all of a user's chats and
 * actions that can be performed on them.
 * @param {ChatMsg} props.msg The chat message.
 * @param {ChatMemberProfile | undefined} props.foundMember
 * Owner of the message.
 * @param {string} props.userID The user ID.
 * @param {Profile | null | undefined} props.userID The logged-in user's info.
 * @returns {JSX.Element} The React component.
 */
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
}): JSX.Element => {
    const fromUser = msg.from_user_id === userID;

    return (
        <>
            <Message
                profile={fromUser ? userProfile : foundMember?.profiles}
                msg={{
                    ...msg,
                    chatter: fromUser
                        ? userProfile
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : "Unknown"
                        : foundMember
                        ? `${foundMember.profiles.first_name} ${foundMember.profiles.last_name}`
                        : "Unknown",
                }}
                fromUser={msg.from_user_id === userID}
                fromServer={true}
            />
        </>
    );
};

export default ChatMsgWrapper;
