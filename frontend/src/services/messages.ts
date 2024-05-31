import { createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { Chat } from "@/types/chat";
import { ChatMsg, ChatMsgSchema, ChatMsgsSchema } from "@/types/message";
import { AxiosResponse } from "axios";
import tweetnacl from "tweetnacl";
import { decode } from "@stablelib/utf8";
import { strToUint8Array } from "@/utils/string";

const api = "messages";

/**
 * Retrieve messages.
 * @param {string} token User access token.
 * @param {Chat} chat The chat to retrieve messages.
 * @param {number} limit Message limit.
 * @param {string} beforeTimestamp Get messages sent before this timestamp.
 * @param {Uint8Array | undefined} publicKey Chat's public key.
 * @param {Uint8Array | undefined} privateKey Chat's private key.
 * @returns {ChatMsg[]} The chat members data.
 */
const getMessages = async (
    token: string,
    chat: Chat,
    limit: number,
    beforeTimestamp: string,
    publicKey?: Uint8Array | undefined,
    privateKey?: Uint8Array | undefined
): Promise<ChatMsg[]> => {
    const request = await apiClient.get(
        `/${api}/${chat.id}?beforeTimestamp=${beforeTimestamp}&limit=${limit}`,
        createAuthHeader(token)
    );
    const msgs = ChatMsgsSchema.validateSync(request.data);

    if (chat.encrypted && publicKey && privateKey) {
        const returnMsgs = msgs.map((msg) => {
            try {
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
                    return {
                        ...msg,
                        text: decryptedMessage,
                    };
                }
                return {
                    ...msg,
                    text: "Cannot decrypt message.",
                };
            } catch (e) {
                console.error(e);
                return {
                    ...msg,
                    text: "Cannot decrypt message.",
                };
            }
        });

        return returnMsgs;
    } else if (chat.encrypted && !privateKey)
        return msgs.map((msg) => {
            return {
                ...msg,
                text: "Encrypted messsage. Enter correct private key to decrypt.",
            };
        });
    else return msgs;
};

/**
 * Sends a message to chat.
 * @param {string} token User access token.
 * @param {string} text Message's content.
 * @param {string} chatID Chat's id.
 * @returns {ChatMsg} The chat message sent.
 */
const sendMessage = async (
    token: string,
    text: string,
    chatID: string
): Promise<ChatMsg> => {
    const request = await apiClient.post(
        `/${api}/${chatID}`,
        { text },
        createAuthHeader(token)
    );

    return ChatMsgSchema.validate(request.data);
};

/**
 * Edits a message.
 * @param {string} token User access token.
 * @param {string} msgID Message's id.
 * @param {string} text Message's edited content.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const editMessage = async (
    token: string,
    msgID: string,
    text: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.put(
        `/${api}/${msgID}`,
        { text },
        createAuthHeader(token)
    );

    return request;
};

/**
 * Deletes a message.
 * @param {string} token User access token.
 * @param {string} msgID Message's id.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const deleteMessage = async (
    token: string,
    msgID: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const request = await apiClient.delete(
        `/${api}/${msgID}`,
        createAuthHeader(token)
    );

    return request;
};
export { getMessages, editMessage, deleteMessage, sendMessage };
