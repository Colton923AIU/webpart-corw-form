import getUserIdByemail from "../../getters/getUserIdByEmail/getUserIdByEmail";

type TsetAAFAAdvisor = {
  items: any[];
  formData: any;
  formDataSetter: (value: any) => void;
};

const setAAFAAdvisor = async ({
  items,
  formData,
  formDataSetter,
}: TsetAAFAAdvisor) => {
  const newFormData = { ...formData };
  if (items.length > 0) {
    const user = await getUserIdByemail(items[0].secondaryText);

    newFormData.AA_x002f_FAAdvisorId = user.Id;
    // Update state with new form data
    formDataSetter(newFormData);
  }
};

export default setAAFAAdvisor;
