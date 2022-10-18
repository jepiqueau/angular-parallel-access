import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  implements OnInit {
  constructor(private databaseService: DatabaseService) {
  }
  async ngOnInit() {
    try {
      console.log(`in AppComponent initialize`);
      await this.databaseService.initialize();
      console.log(`in AppComponent starting runTests`);
      await this.databaseService.runTests();
    } catch(err) {
      const msg = err.message ? err.message : err;
    }
  }
}
