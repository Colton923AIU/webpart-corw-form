import { IPersonaProps } from "@fluentui/react";

export interface CWForm {
  AAFAAdvisor: IPersonaProps;
  CDOA: {} | null | undefined;
  DSM: {} | null | undefined;
  CorW: string | null | undefined;
  DocumentedInNotes: string | null | undefined;
  ESA: true | false | null | undefined;
  InstructorName: string | null | undefined;
  Notes: string | null | undefined;
  StartDate: Date | null | undefined;
  StudentId: number | null | undefined;
  StudentName: string | null | undefined;
}
