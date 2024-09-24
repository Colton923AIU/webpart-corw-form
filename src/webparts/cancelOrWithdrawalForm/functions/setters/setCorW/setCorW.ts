type TsetCorW = {
  formData: any;
  e: any;
  formDataSetter: ({}: any) => void;
  option: any;
};

const setCorW = ({ formData, e, formDataSetter, option }: TsetCorW) => {
  const newFormData = { ...formData };
  newFormData.CorW = option.text;
  formDataSetter(newFormData);
};

export default setCorW;
