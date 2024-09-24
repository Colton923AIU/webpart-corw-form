import { Resolver } from "react-hook-form";
import { CWForm } from "../types/CWForm";
const resolver: Resolver<CWForm> = async (values) => {
  const errors: Record<string, any> = {};

  if (!values.AAFAAdvisor) {
    errors.AAFAAdvisor = {
      type: "required",
      message: "AAFA Advisor is required.",
    };
  }

  if (!values.CDOA) {
    errors.CDOA = { type: "required", message: "CDOA selection is required." };
  }

  if (!values.DSM) {
    errors.DSM = { type: "required", message: "DSM selection is required." };
  }

  if (!values.CorW) {
    errors.CorW = {
      type: "required",
      message: "You must select either Cancel or Withdrawal.",
    };
  }

  if (!values.StudentId) {
    errors.StudentId = { type: "required", message: "Student ID is required." };
  }

  if (!values.StudentName) {
    errors.StudentName = {
      type: "required",
      message: "Student Name is required.",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export default resolver;
