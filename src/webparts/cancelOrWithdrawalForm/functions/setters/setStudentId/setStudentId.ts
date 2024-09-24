type TsetStudentId = {
  formData: any;
  e: any;
  formDataSetter: ({}: any) => void;
};

const setStudentId = ({ formData, e, formDataSetter }: TsetStudentId) => {
  const newFormData = { ...formData };
  newFormData.StudentID = parseInt(e.target.value);
  formDataSetter(newFormData);
  return;
};

export default setStudentId;
