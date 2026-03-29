import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class I18nRouterTitleRepository extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translateService = inject(TranslateService)

  constructor()
  {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot)
  {
    const key = this.buildTitle(snapshot);
    if (!key) return;
    this.translateService.get(key).subscribe(translated => { this.title.setTitle(translated); });
  }
}
