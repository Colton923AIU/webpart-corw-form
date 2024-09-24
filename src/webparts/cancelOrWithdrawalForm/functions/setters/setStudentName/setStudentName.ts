type TsetStudentName = {
  formData: any;
  e: any;
  formDataSetter: ({}: any) => void;
};

const setStudentName = ({ formData, e, formDataSetter }: TsetStudentName) => {
  const newFormData = { ...formData };
  newFormData.StudentName = e.target.value;
  formDataSetter(newFormData);
};

export default setStudentName;
