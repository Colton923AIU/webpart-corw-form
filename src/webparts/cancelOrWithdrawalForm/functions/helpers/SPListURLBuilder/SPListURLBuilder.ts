/*  The SP List URL Builder is a function that takes the reqType literal
    and url string and returns a suitable http request url.

    The reqType literal is an in-url function name that microsoft provides.
*/
type TSPListURLBuilder = {
  reqType: `getuserbyid` | `placeholder-literal`;
  url: string;
};
/*
        spListStrings is a literal hardcoded into another file per 
        spListStrings.cdoaToDsmMap is the url for the cdoa to dsm map sp list
    */
const SPListURLBuilder = ({ reqType, url }: TSPListURLBuilder) => {
  const basePath = new URL(url).origin;
  const subsites = url.split("Lists")[0].split("com")[1];

  return (id: string) => {
    return basePath + subsites + `_api/web/${reqType}(${id})`;
  };
};

export default SPListURLBuilder;
