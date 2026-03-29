import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-server-unavailable',
  imports: [TranslateModule],
  templateUrl: './server-unavailable.html',
  styleUrl: './server-unavailable.scss',
})
export class ServerUnavailable {}
