import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import * as y from "yup";
import toast from "react-hot-toast";
//import queryClient from "@/config/queryClient";
import {
    deleteMessage,
    editMessage,
    getMessages,
    sendMessage,
} from "@/services/messages";
import { ChatMsg, ChatMsgSchema, ChatMsgsSchema } from "@/types/message";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";

export const useMessages = (
    token: string,
    chatID: string,
    limit: number = 10
) => {
    const curTime = new Date().toISOString();
    const [currentMessages, setCurrentMessages] = useState<ChatMsg[]>([]);

    useEffect(() => {
        const listen = () => {
            const msgListener = supabase
                .channel("custom-all-channel")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter: `chat_id=eq.${chatID}`,
                    },
                    (payload) => {
                        const msg = ChatMsgSchema.validateSync(payload.new);
                        setCurrentMessages(currentMessages.concat(msg));
                    }
                )
                .subscribe();

            return () => msgListener.unsubscribe();
        };

        return void listen();
    }, []);

    const infiniteMessages = useInfiniteQuery<ChatMsg[], Error>({
        queryKey: [`MSG_${chatID}_INFINITE`],
        initialPageParam: curTime,
        queryFn: ({ pageParam }) => {
            const timestamp = y.string().required().validateSync(pageParam);
            return getMessages(token, chatID, limit, timestamp);
        },
        getNextPageParam: (lastPage, _allPages) => {
            if (lastPage && lastPage.length > 0) {
                const msgs = ChatMsgsSchema.validateSync(lastPage);
                return msgs[msgs.length - 1 < 0 ? 0 : msgs.length - 1].sent_at;
            }
            return null;
        },
        enabled: !!token,
    });

    return {
        infinite: infiniteMessages,
        finalData:
            currentMessages.concat(infiniteMessages.data?.pages.flat() ?? []) ??
            [],
    };
};

export const useDeleteMessage = () => {
    return useMutation({
        mutationFn: ({ token, msgID }: { token: string; msgID: string }) =>
            deleteMessage(token, msgID),
        onSuccess: () => {
            toast.success("Message deleted successfully.");
        },
    });
};

export const useSendMessage = () => {
    return useMutation({
        mutationFn: ({
            token,
            text,
            chatID,
        }: {
            token: string;
            text: string;
            chatID: string;
        }) => sendMessage(token, text, chatID),
        onSuccess: () => {
            toast.success("Message sent successfully.");
        },
    });
};

export const useEditMessage = () => {
    return useMutation({
        mutationFn: ({
            token,
            msgID,
            text,
        }: {
            token: string;
            msgID: string;
            text: string;
        }) => editMessage(token, msgID, text),
        onSuccess: () => {
            toast.success("Message edited successfully.");
        },
    });
};
