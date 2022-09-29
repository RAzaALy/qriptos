import { BehaviorSubject } from "rxjs";
import { useSnackbar } from "notistack";

import useHandleResponse from "../Utilities/handle-response";

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
  const handleResponse = useHandleResponse();

  const getKey = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/user/wallet/saveKey`,
      requestOptions
    )
      .then(handleResponse)
      .then((data) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });
        localStorage.setItem("currentUser", JSON.stringify(data));
        currentUserSubject.next(data);
        return data;
      })
      .catch(function () {
        enqueueSnackbar("Failed to Login", {
          variant: "error",
        });
      });
  };

  return getKey;
}

export function useGenerateName() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const getNames = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/user/wallet/generateName`,
      requestOptions
    )
      .then(handleResponse)
      .then((data) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data;
      })
      .catch(function () {
        enqueueSnackbar("Failed to Generate Name", {
          variant: "error",
        });
      });
  };

  return getNames;
}
export function useSaveName() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const saveName = (address, userName) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, userName }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/user/wallet/saveName`,
      requestOptions
    )
      .then(handleResponse)
      .then((data) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });

        return data;
      })
      .catch(function () {
        enqueueSnackbar("Failed to Save Name", {
          variant: "error",
        });
      });
  };

  return saveName;
}

export function useSavePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const savePassword = (address, password) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/user/wallet/savePassword`,
      requestOptions
    )
      .then(handleResponse)
      .then((data) => {
        enqueueSnackbar(data.message, {
          variant: "success",
        });
        localStorage.setItem("currentUser", JSON.stringify(data));
        currentUserSubject.next(data);

        return data;
      })
      .catch(function (response) {
        if (response) {
          enqueueSnackbar(response, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Failed to Register", {
            variant: "error",
          });
        }
      });
  };

  return savePassword;
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
}
