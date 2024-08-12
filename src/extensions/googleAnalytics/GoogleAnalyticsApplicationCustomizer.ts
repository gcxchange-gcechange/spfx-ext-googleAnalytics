import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'GoogleAnalyticsApplicationCustomizerStrings';

const LOG_SOURCE: string = 'GoogleAnalyticsApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IGoogleAnalyticsApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  id: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class GoogleAnalyticsApplicationCustomizer
  extends BaseApplicationCustomizer<IGoogleAnalyticsApplicationCustomizerProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    
    this.context.application.navigatedEvent.add(this, this.addGoogleTag);
 

    let message: string = this.properties.testMessage;

    if (!message) {
      message = '(No properties were provided.)';

    }

    Dialog.alert(`${this.properties.id}`).catch(() => {
      /* handle error */
    });

    return Promise.resolve();
  }

  public addGoogleTag ():void {
  
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${this.properties.id}`;
    const scriptContent = document.createElement('script');
    scriptContent.innerHTML = `
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', '${this.properties.id}');
    `
   document.head.appendChild(scriptTag);
   document.head.appendChild(scriptContent);

  }

}
