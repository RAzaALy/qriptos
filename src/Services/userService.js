import { useSnackbar } from "notistack";
import { instance } from "../Utilities/instance";

export function useViewContact() {
  const { enqueueSnackbar } = useSnackbar();
  const viewContact = () => {
    return instance
      .get("/api/user/viewContact")
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
  return viewContact;
}
export function useViewProfile() {
  const { enqueueSnackbar } = useSnackbar();
  const viewProfile = (key) => {
    return instance
      .get(`api/chat/viewUser/${key}`)
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
  return viewProfile;
}
