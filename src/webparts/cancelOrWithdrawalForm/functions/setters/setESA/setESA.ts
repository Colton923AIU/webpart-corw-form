type TsetESA = {
  formData: any;
  option: any;
  formDataSetter: ({}: any) => void;
};

const setESA = ({ formData, option, formDataSetter }: TsetESA) => {
  const newFormData = { ...formData };
  newFormData.ESA = option.text === "Yes" ? true : false;
  formDataSetter(newFormData);
};

export default setESA;
