import * as React from "react";
import * as ReactDom from "react-dom";
import {
  type IPropertyPaneConfiguration,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart, WebPartContext } from "@microsoft/sp-webpart-base";

import CancelOrWithdrawalForm from "./components/CancelOrWithdrawalForm";
import { ICancelOrWithdrawalFormProps } from "./components/CancelOrWithdrawalForm";

export interface ICancelOrWithdrawalWebPartProps {
  description: string;
  absoluteUrl: string;
  context: WebPartContext; 
}

export default class CancelOrWithdrawalWebPart extends BaseClientSideWebPart<ICancelOrWithdrawalWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ICancelOrWithdrawalFormProps> = React.createElement(
      CancelOrWithdrawalForm,
      {
        userDisplayName: this.context.pageContext.user.displayName,
        absoluteUrl: this.context.pageContext.web.absoluteUrl,
        msGraphClientFactory: this.context.msGraphClientFactory,
        spHttpClient: this.context.spHttpClient,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
      ],
    };
  }
}
