type TsetNotes = {
  formData: any;
  e: any;
  formDataSetter: ({}: any) => void;
};

const setNotes = ({ formData, e, formDataSetter }: TsetNotes) => {
  const newFormData = { ...formData };
  newFormData.Notes = e.target.value;
  formDataSetter(newFormData);
};

export default setNotes;
