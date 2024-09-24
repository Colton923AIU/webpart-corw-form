import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import { MSGraphClientFactory } from "@microsoft/sp-http"; // Add this for MSGraph

export interface ICancelOrWithdrawalFormProps {
  userDisplayName: string;
  absoluteUrl: string;
  spHttpClient: SPHttpClient;
  msGraphClientFactory: MSGraphClientFactory; // Ensure this is correctly typed
  context: WebPartContext;
}
