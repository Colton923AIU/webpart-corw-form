import { z } from "zod";
import { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CWForm } from "../types/CWForm";

// Define the Zod schema for CWForm with conditional logic
const CWFormSchema = z.object({
  AAFAAdvisor: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .nonempty("AAFA Advisor is required."),
  CDOA: z
    .object({
      key: z.string(),
      text: z.string(),
    })
    .nonempty("CDOA selection is required."),
  DSM: z.string().nonempty("DSM selection is required."),
  CorW: z.enum(["Cancel", "Withdrawal"]).nonempty("You must select either Cancel or Withdrawal."),
  StudentId: z.string().nonempty("Student ID is required."),
  StudentName: z.string().nonempty("Student Name is required."),
  StartDate: z.date().nonempty("Start Date is required."),

  // Conditionally required fields for "Withdrawal"
  Notes: z.string().optional(),
  DocumentedInNotes: z.string().optional(),
  InstructorName: z.string().optional(),
  ESA: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.CorW === "Withdrawal") {
    if (!data.Notes) {
      ctx.addIssue({
        path: ["Notes"],
        message: "Student's Exact Written Request is required for Withdrawal.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.DocumentedInNotes) {
      ctx.addIssue({
        path: ["DocumentedInNotes"],
        message: "Documented in Notes is required for Withdrawal.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.InstructorName) {
      ctx.addIssue({
        path: ["InstructorName"],
        message: "Instructor Name is required for Withdrawal.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.ESA === undefined) {
      ctx.addIssue({
        path: ["ESA"],
        message: "ESA is required for Withdrawal.",
        code: z.ZodIssueCode.custom,
      });
    }
  }
});

// Create the resolver using zodResolver
const resolver: Resolver<CWForm> = zodResolver(CWFormSchema);

export default resolver;
