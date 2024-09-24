type TsetStartDate = {
  formData: any;
  e: any;
  formDataSetter: ({}: any) => void;
};

const setStartDate = ({ formData, e, formDataSetter }: TsetStartDate) => {
  const newFormData = { ...formData };
  newFormData.StartDate = new Date(e.target.value).toISOString();
  formDataSetter(newFormData);
};

export default setStartDate;
