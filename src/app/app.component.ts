import { Component, HostListener, Host, AfterViewInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'pwanew';
  ori;

  deferredPrompt: any;
  showButton = false;

  ngAfterViewInit() {
    this.fullScreen();
  }
  @HostListener('window:orientationchange', ['$event']) 
  onorientationchange(e) {
    this.ori = window.orientation == 90 ? 'landscape' : 'portrait'
  }

  @HostListener('window:contextmenu', ['$event'])
  oncontextmenu(e) {
    confirm('context menu disable');
    e.preventDefault();
  }

  fullScreen() {
    document.documentElement.requestFullscreen();
    screen.orientation.lock("portrait-primary");
  }
  
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);

    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  constructor(private swUpdate: SwUpdate,

  ) {
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  ngOnInit() {

    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

        if (confirm("New version available. Load New Version?")) {

          window.location.reload();
        }
      });
    }

  }
}
