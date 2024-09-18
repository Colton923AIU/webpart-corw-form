import * as React from 'react'
import { IPeoplePickerContext, PeoplePicker as PeoplePickerUI, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

interface PeoplePickerProps{
  peoplePickerContext: IPeoplePickerContext
  onChange: (items: any[])=>void
}

const PeoplePicker = (props: PeoplePickerProps) => {

  return (
  <PeoplePickerUI
    context={props.peoplePickerContext}
    titleText="CDOA"
    personSelectionLimit={1}
    showtooltip={true}
    required={true}
    disabled={false}
    searchTextLimit={5}
    onChange={props.onChange}
    principalTypes={[PrincipalType.User]}
    resolveDelay={1000} />
  )
}

export default PeoplePicker