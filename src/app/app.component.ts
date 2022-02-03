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
    const ret = await this.databaseService.initialize();
    console.log(`in AppComponent initialize ${ret}`);
    if(ret) {
      await this.databaseService.runTests();
    }
  }
}
