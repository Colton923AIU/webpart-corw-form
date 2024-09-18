import { SPHttpClient, type SPHttpClientResponse } from "@microsoft/sp-http";
import * as React from "react";

// Function to parse the SharePoint List link
export const SPListLinkParser = (link: string): string | undefined => {
  const parts = link.split("/")[link.split("/").indexOf("Lists") + 1];
  return parts ? parts.replace(/%20/g, " ").split("?")[0] : undefined;
};

// Function to construct the URL for fetching SharePoint list data by title
export const urlGetByTitle = ({
  absoluteUrl,
  spListLink,
}: {
  absoluteUrl: string;
  spListLink: string;
}): string | undefined => {
  if (!absoluteUrl || !spListLink || absoluteUrl.length < 3 || spListLink.length < 3) {
    return undefined;
  }

  const parsedLink = SPListLinkParser(spListLink);
  if (!parsedLink) return undefined;

  const basePath = new URL(spListLink).origin;
  const subsites = spListLink.split("Lists")[0].split("com")[1];
  return `${basePath}${subsites}_api/web/lists/GetByTitle('${parsedLink}')`;
};

export type TSPListData = Record<string, string>[];

export interface ISPListData {
  client: SPHttpClient; // SP Client for making fetch requests
  spListLink: string;
  absoluteUrl: string;
}

/*
    Custom Hook to fetch and return SharePoint List Data
    based on the user's provided SharePoint list link.
*/

const useSharePointListData = ({
  client,
  spListLink,
  absoluteUrl,
}: ISPListData): [TSPListData | undefined] => {
  const [listData, setListData] = React.useState<TSPListData | undefined>(undefined);

  // Function to fetch SharePoint list data
  const getSPListData = async (url: string): Promise<void> => {
    try {
      const response: SPHttpClientResponse = await client.get(url, SPHttpClient.configurations.v1);
      const data = await response.json();
      if (data && data.value) {
        setListData(data.value);
      } else {
        console.error("No data found in the SharePoint list response.");
      }
    } catch (error) {
      console.error("Error fetching data from SharePoint list:", error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const url = urlGetByTitle({ absoluteUrl, spListLink });
      if (url) {
        await getSPListData(`${url}/items`);
      } else {
        console.error("Invalid SharePoint list URL.");
      }
    };

    if (absoluteUrl && spListLink) {
      fetchData();
    }
  }, [absoluteUrl, spListLink, client]);

  return [listData];
};

export default useSharePointListData;
