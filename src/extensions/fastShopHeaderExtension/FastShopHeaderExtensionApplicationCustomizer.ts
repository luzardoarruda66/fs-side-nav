import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import '@pnp/sp/webs';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { sp } from '@pnp/sp';
import SideNav from './components/SideNav/SideNav';


export interface IFastShopHeaderExtensionApplicationCustomizerProperties {
  testMessage: string;
}
export default class FastShopHeaderExtensionApplicationCustomizer
  extends BaseApplicationCustomizer<IFastShopHeaderExtensionApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    document.getElementById('sp-appBar').style.width = '260px';

    return super.onInit().then(() => {
      sp.setup({
        spfxContext: this.context,
        defaultCachingStore: "session",
        globalCacheDisable: false
      });
      this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    });
  };


  private _renderPlaceHolders(): void {
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }
      if (this._topPlaceholder.domElement && window.location.href.toLowerCase().indexOf('lists/') === -1 && window.location.href.indexOf('_layouts/') === -1 ) {
        const element = React.createElement(SideNav, {context: this.context});
        ReactDOM.render(element, this._topPlaceholder.domElement);
      }

    }

  }

  private _onDispose(): void {
  }
}
