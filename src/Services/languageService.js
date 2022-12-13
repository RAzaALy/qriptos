import axios from "axios";

const BaseUrl = "https://google-translate1.p.rapidapi.com";

export function useGetLanguages() {
  const options = {
    method: "GET",
    url: `${BaseUrl}/language/translate/v2/languages`,
    headers: {
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": "528e1fc57fmsh096d73acdf792bep11e151jsnf6962a8324fd",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
  };
  const getLanguages = () => {
    return axios
      .request(options)

      .then(({ data }) => {
        return data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return getLanguages;
}
export function useDetectLanguage() {
    const encodedParams = new URLSearchParams();
    encodedParams.append("q", "English is hard, but detectably so");
    
    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': '528e1fc57fmsh096d73acdf792bep11e151jsnf6962a8324fd',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      data: encodedParams
    };
  const detectLanguage = () => {
    return axios
      .request(options)

      .then(({ data }) => {
        console.log(data.data.detections,'data');
        return data.data.detections;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return detectLanguage;
}
