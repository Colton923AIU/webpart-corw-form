import * as React from "react";
import styles from "./CancelOrWithdrawalForm.module.scss";
import {
  IPeoplePickerContext,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PeoplePicker } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { DatePicker, Dropdown, TextField } from "@fluentui/react";
import useSharePointListData from "../hooks/useSharepointListData/useSharepointListData";
import spListStrings from "../loc/spListStrings";
import getUserByID from "../functions/getters/getUserById/getUserByID";
import { useForm, useWatch } from "react-hook-form";
import { CWForm } from "../types/CWForm";
import { ICancelOrWithdrawalFormProps } from "../types/ICancelWithdrawalFormProps";
import resolver from "./resolver";
import submitForm from "../functions/submitForm/submitForm";

const CancelOrWithdrawalForm: React.FC<ICancelOrWithdrawalFormProps> = ({
  absoluteUrl,
  spHttpClient,
  msGraphClientFactory,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CWForm>({
    resolver: resolver,
    defaultValues: {
      StartDate: new Date(),
    },
  });

  const cdoaList = useSharePointListData({
    client: spHttpClient,
    absoluteUrl: absoluteUrl,
    spListLink: spListStrings.cdoaToDsmMap,
  })[0];

  const [cdoaData, setCDOAData] = React.useState<
    { name: string; CDOAId: number }[] | null
  >(null);
  const hasFetched = React.useRef(false); // To prevent multiple fetches

  React.useEffect(() => {
    const getCDOANames = async (group: any[]) => {
      const names = await Promise.all(
        group.map(async (item) => {
          const user = await getUserByID({
            id: item.CDOAId,
            spHttpClient: spHttpClient,
            url: spListStrings.cdoaToDsmMap,
          });
          return { name: user?.Title, CDOAId: user?.Id } || "";
        })
      );
      return names;
    };

    const loadCDOANames = async () => {
      if (!cdoaList) return;
      const data = await getCDOANames(cdoaList);
      setCDOAData(data);
    };

    if (cdoaList && cdoaList.length > 0 && !hasFetched.current) {
      hasFetched.current = true; // Prevent re-fetching
      loadCDOANames();
    }
  }, [cdoaList, spHttpClient]);

  const cdoaValue = useWatch({ name: "CDOA" }); // Watch for changes to CDOA

  // Effect for setting DSM based on selected CDOA
  React.useEffect(() => {
    const findDSM = async (CDOAId: string) => {
      const DSM = cdoaList.find((item) => item.CDOAId.toString() === CDOAId);
      if (!DSM) {
        console.log("Finding DSM Error");
        return;
      }

      const DSMId = DSM.DSMId;
      const userDataDSM = await getUserByID({
        id: DSMId.toString(),
        spHttpClient,
        url: spListStrings.cdoaToDsmMap,
      });

      console.log("DSM user data: ", userDataDSM);
      setDsmValue(userDataDSM.Title); // Set the DSM value
      setValue("DSM", userDataDSM.Title); // Set the DSM in the form
    };

    if (cdoaValue) {
      findDSM(cdoaValue.key);
    }
  }, [cdoaValue, cdoaList, setValue, spHttpClient]);

  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: absoluteUrl,
    msGraphClientFactory: msGraphClientFactory,
    spHttpClient: spHttpClient,
  };

  if (!cdoaData) {
    return null;
  }

  return (
    <div className={styles.cancelOrWithdrawalForm}>
      <h2>Cancel / Withdrawal Form</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        {errors && Object.keys(errors).length > 0 && (
          <p>{JSON.stringify(errors)}</p>
        )}
        <Dropdown
          errorMessage={errors.CorW?.message}
          {...register("CorW", { required: true })}
          label={"Request Type"}
          options={[
            { key: "cancel", text: "Cancel" },
            { key: "withdrawal", text: "Withdrawal" },
          ]}
          onChange={(e, option) => {
            setValue("CorW", option?.text as string | null | undefined);
          }}
        />
        <TextField
          errorMessage={errors.StudentName?.message}
          {...register("StudentName", { required: true })}
          label={"Student Name"}
          onChange={(e) => {
            setValue("StudentName", e.currentTarget.value);
          }}
        />
        <TextField
          errorMessage={errors.StudentId?.message}
          {...register("StudentId", { required: true })}
          label={"Student ID"}
          type={"number"}
          onChange={(e) => {
            setValue("StudentId", parseInt(e.currentTarget.value));
          }}
        />
        <DatePicker
          {...register("StartDate", { required: true })}
          label={"Current Start Date"}
          onSelectDate={(date) => {
            setValue("StartDate", date);
          }}
        />
        {watch("CorW") === "Withdrawal" && (
          <>
            <TextField
              errorMessage={errors.Notes?.message}
              {...register("Notes", {
                required: watch("CorW") === "Withdrawal",
              })}
              label={"Student's Exact Written Request"}
              type={"text"}
              onChange={(e) => {
                setValue("Notes", e.currentTarget.value);
              }}
            />
            <Dropdown
              errorMessage={errors.DocumentedInNotes?.message}
              {...register("DocumentedInNotes", {
                required: watch("CorW") === "Withdrawal",
              })}
              label={"Documented in Notes"}
              options={[
                { key: "yes", text: "Yes" },
                { key: "no", text: "No" },
              ]}
              onChange={(e, option) => {
                setValue("DocumentedInNotes", option?.text);
              }}
            />
            <TextField
              errorMessage={errors.InstructorName?.message}
              {...register("InstructorName", {
                required: watch("CorW") === "Withdrawal",
              })}
              label={"Instructor Name"}
              type={"text"}
              onChange={(e) => {
                setValue("InstructorName", e.currentTarget.value);
              }}
            />
            <Dropdown
              errorMessage={errors.ESA?.message}
              {...register("ESA", {
                required: watch("CorW") === "Withdrawal",
              })}
              label={"ESA"}
              options={[
                { key: "yes", text: "Yes" },
                { key: "no", text: "No" },
              ]}
              onChange={(e, option) => {
                setValue("ESA", option?.text === "Yes");
              }}
            />
          </>
        )}
        <PeoplePicker
          errorMessage={errors.AAFAAdvisor?.message}
          {...register("AAFAAdvisor", { required: true })}
          context={peoplePickerContext}
          titleText="Financial Aid Advisor (AA or FA to be notified)"
          personSelectionLimit={1}
          showtooltip={true}
          disabled={false}
          searchTextLimit={5}
          onChange={(items) => {
            setValue("AAFAAdvisor", items);
          }}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000}
        />
        <Dropdown
          errorMessage={errors.CDOA?.message}
          {...register("CDOA", { required: true })}
          label={"CDOA Name"}
          options={cdoaData.map(({ name, CDOAId }) => ({
            key: CDOAId.toString(),
            text: name,
          }))}
          onChange={(e, option) => {
            setValue("CDOA", option);
          }}
        />
        <TextField
          errorMessage={errors.DSM?.message}
          {...register("DSM", { required: true })}
          disabled
          label={"DSM"}
          type={"text"}
          value={watch("DSM")}
        />
        <input
          type="submit"
          style={{
            padding: ".5rem",
            backgroundColor: "white",
            fontWeight: 700,
            margin: ".5rem 1rem",
          }}
        />
      </form>
    </div>
  );
};

export default CancelOrWithdrawalForm;
