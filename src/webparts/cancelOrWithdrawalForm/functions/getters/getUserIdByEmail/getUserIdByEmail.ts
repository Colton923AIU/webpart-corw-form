import { SPHttpClient } from "@microsoft/sp-http";

type TgetUserIdByemail = {
  spHttpClient: SPHttpClient;
  email: string;
};

const getUserIdByemail = async ({ spHttpClient, email }: TgetUserIdByemail) => {
  const userUrl = `https://livecareered.sharepoint.com/_api/web/siteusers?$filter=Email eq '${email}'`;

  const response = await spHttpClient.get(
    userUrl,
    SPHttpClient.configurations.v1
  );

  if (!response.ok) {
    throw new Error("Error fetching user: " + response.statusText);
  }

  const data = await response.json();
  const user = data.value[0];
  return {
    Id: parseInt(user.Id),
    Title: user.Title,
    Email: user.Email,
  };
};

export default getUserIdByemail;
