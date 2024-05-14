import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import * as y from "yup";
import toast from "react-hot-toast";
//import queryClient from "@/config/queryClient";
import {
    deleteMessage,
    editMessage,
    getMessages,
    sendMessage,
} from "@/services/messages";
import { ChatMsg } from "@/types/message";

export const useMessages = (
    token: string,
    chatID: string,
    inclusiveLimit: number = 7
) => {
    const curTime = new Date().toISOString();
    
useEffect(() => {
  const msgListener = supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatID}`, },
      (payload) => {
        console.log("Change received!", payload);
          // either concatenate to infinite data or put it in a new state
      }
    )
    .subscribe();

  return msgListener.unsubscribe();
}, []);
    
    const currentMessages = useQuery<ChatMsg[]>({
        queryKey: [`MSG_${chatID}_CURRENT`],
        queryFn: () => [],
        enabled: !!token,
    });

    const infiniteMessages = useInfiniteQuery<ChatMsg[], Error>({
        queryKey: [`MSG_${chatID}_INFINITE`],
        initialPageParam: 0,
        queryFn: ({ pageParam }) => {
            const page = y.number().required().validateSync(pageParam);
            return getMessages(token, chatID, page, page + inclusiveLimit, curTime);
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            const page = y.number().required().validateSync(lastPageParam);
            if (
                lastPage &&
                lastPage.length > 0 &&
                lastPage.length >= inclusiveLimit
            )
                return page + inclusiveLimit + 1;
            return null;
        },
        enabled: !!token,
    });

    return {
        infinite: infiniteMessages,
        finalData:
            infiniteMessages.data?.pages
                .flat() ?? [],
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

export const useEditChat = () => {
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
