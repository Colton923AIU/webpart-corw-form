import { SubmitHandler } from "react-hook-form";
import { CWForm } from "../../types/CWForm";
import spListStrings from "../../loc/spListStrings";
import { SPHttpClient } from "@microsoft/sp-http";

type TSubmitFormProps = {
  data: CWForm,
spHttpClient: SPHttpClient
}

const submitForm: SubmitHandler<TSubmitFormProps> = (data, spHttpClient) => {
  const listUrl = spListStrings.corw;
  spHttpClient
    .post(listUrl, SPHttpClient.configurations.v1, {
      body: JSON.stringify(data),
    })
    .then((response: any) => {
      if (!response.ok) {
        return response.json().then((err: any) => {
          throw new Error(JSON.stringify(err));
        });
      }
      return response.json();
    })
    .then((data: any) => {
      console.log("Success:", data);
    })
    .catch((error: any) => {
      console.log("Fail:", error);
    });
};

export default submitForm;
