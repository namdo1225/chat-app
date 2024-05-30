import {
    InfiniteData,
    UseInfiniteQueryResult,
    UseMutationResult,
    useInfiniteQuery,
    useMutation,
} from "@tanstack/react-query";
import * as y from "yup";
import toast from "react-hot-toast";
import {
    deleteMessage,
    editMessage,
    getMessages,
    sendMessage,
} from "@/services/messages";
import { ChatMsg, ChatMsgSchema, ChatMsgsSchema } from "@/types/message";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { AxiosResponse } from "axios";
import { queryClient } from "@/config/queryClient";
import tweetnacl from "tweetnacl";
import { Chat } from "@/types/chat";
import { encode } from "@stablelib/utf8";
import { convertDateToUTC } from "@/utils/date";

type UseMessages = {
    infiniteMessages: UseInfiniteQueryResult<
        InfiniteData<ChatMsg[], unknown>,
        Error
    >;
    finalData: ChatMsg[];
};

/**
 * Hook to retrieve messages.
 *
 * @param {string} token User access token.
 * @param {Chat} chat Chat's ID.
 * @param {number} limit Number of messages to get.
 * public chats or a user's chats.
 * @returns {UseMessages} The hook.
 */
export const useMessages = (
    token: string,
    chat: Chat,
    limit: number = 10
): UseMessages => {
    const [currentMessages, setCurrentMessages] = useState<ChatMsg[]>([]);
    useEffect(() => {
        const listen = (): (() => Promise<"error" | "ok" | "timed out">) => {
            const msgListener = supabase
                .channel("custom-all-channel")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter: `chat_id=eq.${chat.id}`,
                    },
                    (payload) => {
                        const msg = ChatMsgSchema.validateSync(payload.new);
                        setCurrentMessages((originalMsg) =>
                            [msg].concat(originalMsg)
                        );
                    }
                )
                .subscribe();

            return () => msgListener.unsubscribe();
        };

        return void listen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const infiniteMessages = useInfiniteQuery<ChatMsg[], Error>({
        queryKey: [`MSG_${chat.id}_INFINITE`],
        initialPageParam: convertDateToUTC(new Date()).toISOString(),
        queryFn: ({ pageParam }) => {
            const timestamp = y.string().required().validateSync(pageParam);
            return getMessages(
                token,
                chat,
                limit,
                timestamp.endsWith("Z")
                    ? timestamp
                    : `${timestamp.slice(0, -6)}Z`
            );
        },
        getNextPageParam: (lastPage, _allPages) => {
            if (lastPage && lastPage.length > 0) {
                const msgs = ChatMsgsSchema.validateSync(lastPage);
                return msgs[msgs.length - 1 < 0 ? 0 : msgs.length - 1].sent_at;
            }
            return null;
        },
        enabled: !!token,
        staleTime: 1,
    });

    return {
        infiniteMessages,
        finalData:
            currentMessages.concat(infiniteMessages.data?.pages.flat() ?? []) ??
            [],
    };
};

/**
 * Mutation hook to delete a message.
 * @returns {object} The hook.
 */
export const useDeleteMessage = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        token: string;
        msgID: string;
    },
    unknown
> => {
    return useMutation({
        mutationFn: ({ token, msgID }: { token: string; msgID: string }) =>
            deleteMessage(token, msgID),
        onSuccess: () => {
            toast.success("Message deleted successfully.");
        },
    });
};

/**
 * Mutation hook to send a message.
 * @returns {object} The hook.
 */
export const useSendMessage = (): UseMutationResult<
    ChatMsg,
    Error,
    {
        token: string;
        text: string;
        chat: Chat;
    },
    unknown
> => {
    return useMutation({
        mutationFn: ({
            token,
            text,
            chat,
        }: {
            token: string;
            text: string;
            chat: Chat;
        }) => {
            /*const obj = {
                id: "string",
                sent_at: "string",
                text: "string",
                chat_id: "string",
                from_user_id: "string",
            };*/

            const privateKey = queryClient.getQueryData([
                `CHATS_${chat.id}_PRIVATE_KEY`,
            ]);

            if (
                chat.encrypted &&
                chat.public_key &&
                typeof privateKey === "string"
            ) {
                const nonce = tweetnacl.randomBytes(24);
                const encryptedMessage = tweetnacl.box(
                    encode(text),
                    nonce,
                    Uint8Array.from(
                        chat.public_key.split(",").map((x) => parseInt(x, 10))
                    ),
                    Uint8Array.from(
                        privateKey.split(",").map((x) => parseInt(x, 10))
                    )
                );

                /*console.log("NOW DECRYPTING:");
                const decryptedCode = tweetnacl.box.open(
                    encryptedMessage,
                    nonce,
                    Uint8Array.from(
                        chat.public_key.split(",").map((x) => parseInt(x, 10))
                    ),
                    Uint8Array.from(
                        privateKey.split(",").map((x) => parseInt(x, 10))
                    )
                );

                if (decryptedCode) {
                    const decryptedMessage = decode(decryptedCode);
                    console.log("decryptedMessage:", decryptedMessage);
                }*/

                return sendMessage(
                    token,
                    `${nonce.toString()}.${encryptedMessage.toString()}`,
                    chat.id
                );
            } else {
                return sendMessage(token, text, chat.id);
            }
            //sendMessage(token, text, chat.id);
        },
        onSuccess: () => {
            toast.success("Message sent successfully.");
        },
    });
};

/**
 * Mutation hook to edit a message.
 * @returns {object} The hook.
 */
export const useEditMessage = (): UseMutationResult<
    AxiosResponse<unknown, unknown>,
    Error,
    {
        token: string;
        msgID: string;
        text: string;
    },
    unknown
> => {
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

export const setPrivateKey = (chatID: string, privateKey: string): void => {
    queryClient.setQueryData([`CHATS_${chatID}_PRIVATE_KEY`], privateKey);
};

export const deletePrivateKey = (chatID: string): void => {
    queryClient.removeQueries({
        queryKey: [`CHATS_${chatID}_PRIVATE_KEY`] as string[],
    });
};
