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
import { decode, encode } from "@stablelib/utf8";
import { convertDateToUTC } from "@/utils/date";
import { strToUint8Array } from "@/utils/string";

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
    limit: number = 10,
    publicKey: Uint8Array | undefined,
    privateKey: Uint8Array | undefined
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
                        let msg = ChatMsgSchema.validateSync(payload.new);
                        if (chat.encrypted && publicKey && privateKey) {
                            const split = msg.text.split(".");
                            const nonce = strToUint8Array(split[0]);
                            const encryptedMessage = strToUint8Array(split[1]);

                            const decryptedCode = tweetnacl.box.open(
                                encryptedMessage,
                                nonce,
                                publicKey,
                                privateKey
                            );

                            if (decryptedCode) {
                                const decryptedMessage = decode(decryptedCode);
                                msg = {
                                    ...msg,
                                    text: decryptedMessage,
                                };
                            } else {
                                msg = {
                                    ...msg,
                                    text: "Cannot decrypt message.",
                                };
                            }
                        }

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
                    : `${timestamp.slice(0, -6)}Z`,
                publicKey,
                privateKey
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
            toast.success(
                "Message deleted successfully. Please refresh to see changes."
            );
        },
        onError: () => {
            toast.error("Message failed to delete. Try again later.");
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
        publicKey?: Uint8Array | undefined;
        privateKey?: Uint8Array | undefined;
    },
    unknown
> => {
    return useMutation({
        mutationFn: ({
            token,
            text,
            chat,
            publicKey,
            privateKey,
        }: {
            token: string;
            text: string;
            chat: Chat;
            publicKey?: Uint8Array | undefined;
            privateKey?: Uint8Array | undefined;
        }) => {
            if (chat.encrypted && publicKey && privateKey) {
                const nonce = tweetnacl.randomBytes(24);
                const encryptedMessage = tweetnacl.box(
                    encode(text),
                    nonce,
                    publicKey,
                    privateKey
                );

                return sendMessage(
                    token,
                    `${nonce.toString()}.${encryptedMessage.toString()}`,
                    chat.id
                );
            } else {
                return sendMessage(token, text, chat.id);
            }
        },
        onError: () => {
            toast.error("Message failed to send. Try again later.");
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
        chat: Chat;
        publicKey?: Uint8Array | undefined;
        privateKey?: Uint8Array | undefined;
    },
    unknown
> => {
    return useMutation({
        mutationFn: ({
            token,
            msgID,
            text,
            chat,
            publicKey,
            privateKey,
        }: {
            token: string;
            msgID: string;
            text: string;
            chat: Chat;
            publicKey?: Uint8Array | undefined;
            privateKey?: Uint8Array | undefined;
        }) => {
            if (chat.encrypted && publicKey && privateKey) {
                const nonce = tweetnacl.randomBytes(24);
                const encryptedMessage = tweetnacl.box(
                    encode(text),
                    nonce,
                    publicKey,
                    privateKey
                );

                return editMessage(
                    token,
                    msgID,
                    `${nonce.toString()}.${encryptedMessage.toString()}`
                );
            } else {
                return editMessage(token, msgID, text);
            }
        },
        onSuccess: () => {
            toast.success("Message edited successfully.");
        },
        onError: () => {
            toast.error("Message failed to edit. Try again later.");
        },
    });
};

type EncryptionHook = {
    privateKey: Uint8Array | undefined;
    publicKey: Uint8Array | undefined;
    deleteKey: () => void;
    setNewKey: (key: string) => void;
};

/**
 * Hook to deal with writing and reading a chat's public and private key.
 * @param {Chat} chat The chat.
 * @returns {EncryptionHook} The hook.
 */
export const useEncryptionKey = (chat: Chat): EncryptionHook => {
    const publicKey = chat.public_key
        ? strToUint8Array(chat.public_key)
        : undefined;

    const retrievePrivateKey = (): Uint8Array | undefined => {
        const key = queryClient.getQueryData([`CHATS_${chat.id}_PRIVATE_KEY`]);
        return Array.isArray(key) ? Uint8Array.from(key) : undefined;
    };

    const [privateKey, setPrivateKey] = useState<Uint8Array | undefined>(
        retrievePrivateKey()
    );

    const setNewKey = (key: string): void => {
        const decodedKey = strToUint8Array(key);

        queryClient.setQueryData(
            [`CHATS_${chat.id}_PRIVATE_KEY`],
            Array.from(decodedKey)
        );

        setPrivateKey(decodedKey);
        toast.success(
            "Private key is set for this chat. Please refresh to see decrypted messages."
        );
    };

    const deleteKey = (): void => {
        queryClient.removeQueries({
            queryKey: [`CHATS_${chat.id}_PRIVATE_KEY`],
        });

        setPrivateKey(undefined);
        toast.success(
            "Private key is deleted for this chat. Please refresh to see encrypted messages."
        );
    };

    return {
        publicKey,
        privateKey,
        deleteKey,
        setNewKey,
    };
};
