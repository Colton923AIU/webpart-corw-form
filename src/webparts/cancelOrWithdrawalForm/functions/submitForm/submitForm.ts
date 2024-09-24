const submitForm: SubmitHandler<CWForm> = (data) => {
  const listUrl = spListStrings.corw;
  spHttpClient
    .post(listUrl, SPHttpClient.configurations.v1, {
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(JSON.stringify(err));
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.log("Fail:", error);
    });
};

export default submitForm;
