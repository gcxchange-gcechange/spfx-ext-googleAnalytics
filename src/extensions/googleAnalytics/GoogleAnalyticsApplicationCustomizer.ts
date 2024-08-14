import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import * as strings from 'GoogleAnalyticsApplicationCustomizerStrings';

const LOG_SOURCE: string = 'GoogleAnalyticsApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IGoogleAnalyticsApplicationCustomizerProperties {
  testMessage: string;
  trackingId: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class GoogleAnalyticsApplicationCustomizer
  extends BaseApplicationCustomizer<IGoogleAnalyticsApplicationCustomizerProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    
    this.context.placeholderProvider.changedEvent.add(this, this.addGoogleTag);
    this.context.application.navigatedEvent.add(this, this.addGoogleTag);

    
    console.log("GOOGLE ANALYTICS EXTENSION")

    return Promise.resolve();
  }


  public addGoogleTag ():void {
  
    const scriptTag = document.createElement('script');
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${this.properties.trackingId}`;
    document.body.insertAdjacentElement("beforeend", scriptTag);

    const scriptContent = document.createElement('script');
    scriptContent.innerHTML = `
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', '${this.properties.trackingId}');
    `
    document.body.insertAdjacentElement("beforeend", scriptContent);
  //  document.head.appendChild(scriptTag);
  //  document.head.appendChild(scriptContent);

  }

}
