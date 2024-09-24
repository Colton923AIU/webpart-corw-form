import SPListURLBuilder from "../../helpers/SPListURLBuilder/SPListURLBuilder";
import { SPHttpClient } from "@microsoft/sp-http";

type TgetUserByIDProps = {
  id: string;
  url: string;
  spHttpClient: SPHttpClient;
};

const getUserByID = async ({ id, url, spHttpClient }: TgetUserByIDProps) => {
  const listUrl = SPListURLBuilder({ reqType: "getuserbyid", url: url })(id);

  try {
    const response = await spHttpClient.get(
      listUrl,
      SPHttpClient.configurations.v1
    );
    const data = await response.json();
    if (data) {
      return data;
    }
  } catch {
    console.log("Response from SP List Getter Failed");
    return undefined;
  }
};

export default getUserByID;
