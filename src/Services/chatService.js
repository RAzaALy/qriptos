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
export function useClearGroupChat() {
  const { enqueueSnackbar } = useSnackbar();

  const clearGroupChat = (groupId) => {
    return instance
      .post(`/api/chat/clearGroupChat`, { groupId })
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
  return clearGroupChat;
}
export function useArchiveChat() {
  const { enqueueSnackbar } = useSnackbar();

  const archiveChat = (chatId) => {
    return instance
      .post(`/api/chat/archiveChat`, { chatId })
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
export function useNewChat() {
  const { enqueueSnackbar } = useSnackbar();
  const newChat = (key) => {
    return instance
      .post("/api/user/addContact", { address: key })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data.data;
      })
      .catch(function (err) {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return newChat;
}
export function useNewGroupChat() {
  const { enqueueSnackbar } = useSnackbar();
  const newGroupChat = (name, memberId, msg) => {
    return instance
      .post("/api/chat/createGroup", { name, memberId, msg })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data.data;
      })
      .catch(function (err) {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return newGroupChat;
}
export function useUploadImage() {
  const { enqueueSnackbar } = useSnackbar();
  const uploadImage = (file) => {
    const data = new FormData();
    const fileName = Date.now() + file.name;
    data.append("name", fileName);
    data.append("file", file);
    return instance
      .post("/api/file/uploadFile?file", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data;
      })
      .catch(function (err) {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return uploadImage;
}
export function useGetGroupMessages() {
  const { enqueueSnackbar } = useSnackbar();

  const getGroupMessages = (id) => {
    return instance
      .get(`/api/chat/getGroupMessages/${id}`)
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
  return getGroupMessages;
}
export function useAddGroupMember() {
  const { enqueueSnackbar } = useSnackbar();

  const addGroupMember = ({ groupId, memberId }) => {
    
    return instance
      .post(`/api/chat/addMember`, { groupId, memberId })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return addGroupMember;
}
export function useRemoveGroupMember() {
  const { enqueueSnackbar } = useSnackbar();

  const removeGroupMember = ({ groupId, memberId }) => {
    
    return instance
      .post(`/api/chat/removeMember`, { groupId, memberId })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return removeGroupMember;
}
