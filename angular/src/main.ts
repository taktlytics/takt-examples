import { bootstrapApplication } from '@angular/platform-browser';
import { provideTakt } from '@vskstudio/takt-angular';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideTakt({
      domain: 'example.com',
      endpoint: '/api/event',
      outbound: true,
      track404: true,
      excludeLocalhost: false,
      // scriptOrigin: 'https://stats.example.com', // first-party : sert le tracker depuis votre domaine (anti-adblock)
      // Advanced options (Takt 0.5):
      tagged: true, // autocapture clicks on [data-takt-tag] elements
      // enabled: false, // master kill-switch: disables all tracking at runtime
    }),
  ],
}).catch((err) => console.error(err));
