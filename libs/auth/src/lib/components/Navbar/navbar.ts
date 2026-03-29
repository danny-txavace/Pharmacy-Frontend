import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-navbar',
  imports: [TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  //protected readonly logoUrl = signal('/assets/images/logo_etc.svg');
  protected readonly logoUrl = signal('');
}
