import * as React from 'react';
import styles from './CancelOrWithdrawalForm.module.scss';
import { MSGraphClientFactory } from '@microsoft/sp-http'; // Add this for MSGraph
import { IPeoplePickerContext, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { PeoplePicker } from "@pnp/spfx-controls-react/lib/PeoplePicker"
import { DatePicker, Dropdown, TextField } from '@fluentui/react'
import useSharePointListData from '../hooks/useSharepointListData/useSharepointListData';
import spListStrings from '../loc/spListStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from "@microsoft/sp-http";

export interface ICancelOrWithdrawalFormProps {
  userDisplayName: string;
  absoluteUrl: string;
  spHttpClient: SPHttpClient;
  msGraphClientFactory: MSGraphClientFactory; // Ensure this is correctly typed
  context: WebPartContext
}

const CancelOrWithdrawalForm: React.FC<ICancelOrWithdrawalFormProps> = ({
  userDisplayName,
  absoluteUrl,
  spHttpClient,
  msGraphClientFactory,
  context
}) => {
  const [formData, setFormData] = React.useState<any>({
  })
  const [cOrW, setCorW] = React.useState<string>('')



  const cdoaList = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: 'https://livecareered.sharepoint.com/sites/AIU/Lists/CDOA%20to%20DSM%20Map/AllItems.aspx',
  })[0]
  
  const [cdoaData, setCDOAData] = React.useState<{
    name: string, CDOAId: number
  }[] | null>(null);
  const [dsmValue, setDSMValue] = React.useState<string | null>('')

  const hasFetched = React.useRef(false); // To prevent multiple fetches
  
  const getUserByID = async (id: string) => {
    const basePath = new URL(spListStrings.cdoaToDsmMap).origin;
    const subsites = spListStrings.cdoaToDsmMap.split("Lists")[0].split("com")[1];
    const url = basePath + subsites + `_api/web/getuserbyid(${id})`;

    try {
      const response = await spHttpClient.get(url, SPHttpClient.configurations.v1);
      const data = await response.json();
      if (data) {
        return data;
      }
    } catch {
      console.log("Response from SP List Getter Failed");
      return undefined;
    }
  };

  React.useEffect(() => {
  
    const getCDOANames = async (group: any[]) => {
      const names = await Promise.all(
        group.map(async (item) => {
          const user = await getUserByID(item.CDOAId);
          return {name: user?.Title, CDOAId: user?.Id } || '';
        })
      );
      return names;
    };
  
    const loadCDOANames = async () => {
      if (!cdoaList) {
        console.log("No cdoaList found, skipping");
        return;
      }
  
      console.log("Fetching CDOA names...");
      const data = await getCDOANames(cdoaList);
      setCDOAData(data);
    };
  
    if (cdoaList && cdoaList.length > 0 && !hasFetched.current) {
      hasFetched.current = true; // Prevent re-fetching
      loadCDOANames();
    } else {
      console.log("CDOA list already fetched or empty.");
    }
  }, [cdoaList, spHttpClient]);
  
  

  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: absoluteUrl,
    msGraphClientFactory: msGraphClientFactory,
    spHttpClient: spHttpClient
  };

  type TPerson = {
    id: string,
    imageInitials: string,
    imageUrl: string,
    loginName: string,
    optionalText: string,
    secondaryText: string,
    tertiaryText: string,
    text: string
  }

  const pickFA = (items: TPerson[]) => {
    const newFormData = formData
    newFormData.pickedFA = items[0]
    setFormData(newFormData)
  }
  const pickCDOA = (e: any, option?: any) => {
    const newFormData = formData
    newFormData.pickedCDOA = option.text
      const CDOAId = option.key
    console.log('cdoaList: ', cdoaList)
    const findDSM =async (CDOAId: string) =>{
      const DSM = cdoaList?.filter((item)=>{
        if (item.CDOAId.toString() === CDOAId) {
          return item
        }
      })
      if (!DSM) {
        console.log('finding DSM Error') 
        return
      }
      const DSMId = DSM[0].DSMId
      console.log('believed to be the DSMId: ', DSMId)
const userDataDSM = await getUserByID(DSMId.toString())

      console.log('dsm user data: ', userDataDSM)
      setDSMValue(userDataDSM.Title)
      return
    }

    findDSM(CDOAId)
    setFormData(newFormData)
  }

  const studentNameInput = (e: any) => {
    const newFormData = formData
    newFormData.studentName = e.target.value
    setFormData(newFormData)
  }

  const studentIDInput = (e: any) => {
    const newFormData = formData
    newFormData.studentID = e.target.value
    setFormData(newFormData)
    return
  }

  const currentStartDateInput = (e: any) => {
    const newFormData = formData
    newFormData.currentStartDate = e.target.value
    setFormData(newFormData)
  }

  const cancelOrWithdrawalInput = (e: any, option?: any) => {
    const newFormData = formData
    newFormData.cancelOrWithdrawal = option.text
    setFormData(newFormData)
    setCorW(option.text)
  }

  const esaInput = (e: any, option?: any) => {
    const newFormData = formData
    newFormData.esa = option.text
    setFormData(newFormData)
  }


  const notesInput = (e: any) => {
    const newFormData = formData
    newFormData.notes = e.target.value
    setFormData(newFormData)
  }

  const documentedInNotesInput = (e: any, option?: any) => {
    const newFormData = formData
    newFormData.documentedInNotes = option.text
    setFormData(newFormData)
  }

  const instructorNameInput = (items: TPerson[]) => {
    const newFormData = formData
    newFormData.instructorName = items[0]
    setFormData(newFormData)
  }
  const submitForm = () => {
    // Prepare data to submit
    const validFormData = {
      Title: '',
      StudentName: formData.studentName ?? '',
      StudentID: parseInt(formData.studentID ?? ''),
      CDOAName: formData.pickedCDOA ?? '',
      StartDate: formData.currentStartDate ?? '',
      CorW: formData.cancelOrWithdrawal ?? '',
      ESA: formData.esa ?? '',
      Notes: formData.notes ?? '',
      DocumentedInNotes: formData.documentedInNotes ?? '',
      InstructorName: formData.instructorName ?? '',
      'AA/FAAdvisor': formData.pickedFA ?? '',
    };
  
    // URL to the SharePoint REST API endpoint for the list items
    const listUrl = `https://livecareered.sharepoint.com/sites/Forms/_api/web/lists/getbytitle('Cancel%20or%20Withdrawal%20Request%20Form%20Test')/items`;
  
    spHttpClient.post(
      listUrl,
      SPHttpClient.configurations.v1,
      {
        body: JSON.stringify(validFormData),
      }
    )
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(JSON.stringify(err)); });
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.log('Fail:', error);
    });
  
    console.log('formData:', formData);
  }
  
  
  if (!cdoaData) {
    return null
  }

  return (
    <div className={styles.cancelOrWithdrawalForm}>
      <h2>Cancel / Withdrawal Form</h2>
      <Dropdown required label={'Request Type'} options={[{ key: 'cancel', text: 'Cancel' }, { key: 'withdrawal', text: 'Withdrawal' }]} onChange={cancelOrWithdrawalInput} />
      <TextField required label={'Student Name'} type={'text'} onChange={studentNameInput} />
      <TextField required label={'Student ID'} type={'number'} onChange={studentIDInput} />
      <DatePicker value={new Date()} isRequired label={'Current Start Date'} onChange={currentStartDateInput} />
      {
        cOrW === 'Withdrawal' ? (
          <>
            <TextField required={formData.cancelOrWithdrawal === 'Withdrawal' ? true : false} label={'Students Exact Written Request'} type={'text'} onChange={notesInput} />
            <Dropdown required label={'Documented in Notes'} options={[{ key: 'yes', text: 'Yes' }, { key: 'no', text: 'No' }]} onChange={documentedInNotesInput} />
            <PeoplePicker
              context={peoplePickerContext}
              titleText={'Instructor Name'}
              personSelectionLimit={1}
              showtooltip={true}
              required={cOrW === 'Withdrawal'}
              disabled={false}
              searchTextLimit={5}
              onChange={instructorNameInput}
              principalTypes={[PrincipalType.User]}
              resolveDelay={1000} />
            <Dropdown required label={'ESA'} options={[{ key: 'yes', text: 'Yes' }, { key: 'no', text: 'No' }]} onChange={esaInput} />
          </>
        ) : null}
      <PeoplePicker
        context={peoplePickerContext}
        titleText="Financial Aid Advisor (AA or FA to be notified)"
        personSelectionLimit={1}
        showtooltip={true}
        required={true}
        disabled={false}
        searchTextLimit={5}
        onChange={pickFA}
        principalTypes={[PrincipalType.User]}
        resolveDelay={1000} />
      <Dropdown
        required
        label={'CDOA Name'}
        options={
          cdoaData.reduce((acc, name) => {
            if (!acc.some(option => option.key === name.name)) {
              acc.push({ key: name.CDOAId.toString(), text: name.name });
            }
            return acc;
          }, [] as { key: string, text: string }[])
        }
        onChange={pickCDOA}
      />
      {/* Lookup CDOA's DSM, list it here as the disabled input 
      <div>
      <p>DSM:</p>
      <input disabled />
      </div> */}
         {dsmValue ? ( <TextField disabled label={'DSM'} type={'text'} value={dsmValue} />): null}  
      <button style={{
        padding: '.5rem',
        backgroundColor: 'white',
        fontWeight: 700,
        margin: '.5rem 1rem'
      }} onClick={submitForm}>Submit</button>
    </div>
  );
};

export default CancelOrWithdrawalForm;
