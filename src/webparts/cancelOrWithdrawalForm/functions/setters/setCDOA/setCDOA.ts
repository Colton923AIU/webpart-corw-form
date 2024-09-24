import getUserByID from "../../getters/getUserById/getUserByID";
import { SPHttpClient } from "@microsoft/sp-http";

type TsetCDOA = {
  option: any;
  formData: any;
  cdoaList: {
    CDOAId: number;
    DSMId: number;
  }[];
  spHttpClient: SPHttpClient;
  url: string;
  dsmValueSetter: (title: string) => void;
  formSetter: ({}: any) => void;
};

const setCDOA = (props: TsetCDOA) => {
  const {
    option,
    formData,
    cdoaList,
    spHttpClient,
    url,
    dsmValueSetter,
    formSetter,
  } = { ...props };
  const newFormData = { ...formData };

  const findDSM = async (CDOAId: string) => {
    newFormData.CDOANameId = parseInt(option.key);
    const DSM = cdoaList.filter((item) => {
      if (item.CDOAId.toString() === CDOAId) {
        return item;
      }
    });
    if (!DSM) {
      console.log("finding DSM Error");
      return;
    }
    const DSMId = DSM[0].DSMId;
    const userDataDSM = await getUserByID({
      id: DSMId.toString(),
      spHttpClient: spHttpClient,
      url: url,
    });

    console.log("dsm user data: ", userDataDSM);

    newFormData.CDSMId = parseInt(userDataDSM.Id);
    dsmValueSetter(userDataDSM.Title);
    return;
  };

  findDSM(option.key);
  formSetter(newFormData);
};

export default setCDOA;
