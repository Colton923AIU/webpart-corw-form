type TsetDocumentedInNotesInput = {
  formData: any;
  option: any;
  formDataSetter: ({}: any) => void;
};

const setDocumentedInNotes = ({
  option,
  formData,
  formDataSetter,
}: TsetDocumentedInNotesInput) => {
  const newFormData = { ...formData };
  newFormData.DocumentedInNotes = option.text === "Yes" ? true : false;
  formDataSetter(newFormData);
};

export default setDocumentedInNotes;
