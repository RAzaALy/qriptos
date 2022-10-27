import { BehaviorSubject } from "rxjs";
import { useSnackbar } from "notistack";
import { instance } from "../Utilities/instance";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

export const authenticationService = {
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

export function useGenerateKey() {
  const { enqueueSnackbar } = useSnackbar();

  const getKey = () => {
    return instance
      .post("/api/user/wallet/saveKey")
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });
        localStorage.setItem("currentUser", JSON.stringify(data.data));
        currentUserSubject.next(data.data);
        return data.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };

  return getKey;
}

export function useGenerateName() {
  const { enqueueSnackbar } = useSnackbar();
  const getNames = () => {
    return instance
      .get("/api/user/wallet/generateName")
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

  return getNames;
}
export function useSaveName() {
  const { enqueueSnackbar } = useSnackbar();

  const saveName = (address, userName) => {
    return instance
      .post("/api/user/wallet/saveName", { address, userName })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });
        localStorage.setItem("currentUser", JSON.stringify(data.data));
        currentUserSubject.next(data.data);
        return data.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };

  return saveName;
}

export function useSavePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const savePassword = (address, password) => {
    return instance
      .post("/api/user/wallet/savePassword", { address, password })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });
        localStorage.setItem("currentUser", JSON.stringify(data.data));
        currentUserSubject.next(data.data);
        return data.data;
      })
      .catch((err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };

  return savePassword;
}
export function useLogin() {
  const { enqueueSnackbar } = useSnackbar();
  const login = (address, password) => {
    return instance
      .post("/api/user/wallet/login", { address, password })
      .then(({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });
        localStorage.setItem("currentUser", JSON.stringify(data.data));
        currentUserSubject.next(data.data);

        return data.data;
      })
      .catch(function (err) {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      });
  };
  return login;
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
}
