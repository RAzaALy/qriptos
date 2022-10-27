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
