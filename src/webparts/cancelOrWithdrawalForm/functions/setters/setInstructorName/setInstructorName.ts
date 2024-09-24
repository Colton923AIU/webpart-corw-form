type TsetInstructorName = {
  formData: any;
  e: any;
  formDataSetter: ({}: any) => void;
};

const setInstructorName = ({
  formData,
  e,
  formDataSetter,
}: TsetInstructorName) => {
  const newFormData = { ...formData };
  newFormData.InstructorName = e.target.value;
  formDataSetter(newFormData);
};

export default setInstructorName;
