import { useSnackbar } from "notistack";
import { instance } from "../Utilities/instance";

// Get list of users conversations
export function useGetChats() {
  const { enqueueSnackbar } = useSnackbar();

  const getChats = () => {
    return instance
      .get("/api/chat/getChat")
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return getChats;
}
export function useGetMessages() {
  const { enqueueSnackbar } = useSnackbar();

  const getMessages = (id) => {
    return instance
      .get(`/api/chat/getMessages/${id}`)
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return getMessages;
}
export function useDeleteMessage() {
  const { enqueueSnackbar } = useSnackbar();

  const deleteMessage = (messageId) => {
    return instance
      .post(`/api/chat/deleteMessage`, { messageId })
      .then((res) => {
        enqueueSnackbar(res.data.data, {
          variant: "success",
        });

        return res.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return deleteMessage;
}
export function useClearChat() {
  const { enqueueSnackbar } = useSnackbar();

  const clearChat = (userId) => {
    return instance
      .post(`/api/chat/clearChat`, { userId })
      .then((res) => {
        enqueueSnackbar(res.data.message, {
          variant: "success",
        });

        return res.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return clearChat;
}
export function useArchiveChat() {
  const { enqueueSnackbar } = useSnackbar();

  const archiveChat = (userId) => {
    return instance
      .post(`/api/chat/archiveChat`, { userId })
      .then((res) => {
        enqueueSnackbar(res.data.message, {
          variant: "success",
        });

        return res.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return archiveChat;
}
