import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-license-success',
  imports: [],
  templateUrl: './layout-license-success.html',
  styleUrl: './layout-license-success.scss',
})
export class LayoutLicenseSuccess implements OnInit, OnDestroy {
  private readonly i18nRep = inject(I18nRepository);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subs = new Subscription();

  protected titleText = '';

  private titlePhrases: string[] = [];
  private titlePhraseIndex = 0;
  private titleLetterIndex = 0;
  private titleDeleting = false;
  private titleTypingSpeed = 70;
  private titleDeletingSpeed = 40;
  private titlePauseTime = 14000;

  protected infoText = '';

  private infoPhrases: string[] = [];
  private infoPhraseIndex = 0;
  private infoLetterIndex = 0;
  private infoDeleting = false;
  private infoTypingSpeed = 70;
  private infoDeletingSpeed = 40;
  private infoPauseTime = 3000;

  ngOnInit(): void {
    this.titlePhrases = [
      'Verificação Concluída!',
      'Código Confirmado!'
    ]

    this.infoPhrases = [
      'A preparar os seus dados',
      'Deixando tudo pronto',
      'Isto pode demorar um pouco',
      'Não desligue o seu computador',
      'Falta pouco para terminar'
    ]

    this.typeTitle();
    this.typeInfo();

    setTimeout(() => {
      const auth = `/${this.i18nRep.getLang()}/auth/license-details`;
      this.router.navigateByUrl(auth, { replaceUrl: true });
    }, 20000)
  }

  ngOnDestroy(): void {
    if (this.subs) { this.subs.unsubscribe(); }
  }

  typeTitle() {
    const phrase = this.titlePhrases[this.titlePhraseIndex];

    if (!this.titleDeleting) {
      this.titleText = phrase.substring(0, this.titleLetterIndex++);
    } else {
      this.titleText = phrase.substring(0, this.titleLetterIndex--);
    }

    this.cdr.detectChanges();

    if (!this.titleDeleting && this.titleLetterIndex === phrase.length + 1) {
      this.titleDeleting = true;
      setTimeout(() => this.typeTitle(), this.titlePauseTime);
      return;
    }

    if (this.titleDeleting && this.titleLetterIndex === 0) {
      this.titleDeleting = false;
      this.titlePhraseIndex = (this.titlePhraseIndex + 1) % this.titlePhrases.length;
    }

    const speed = this.titleDeleting ? this.titleDeletingSpeed : this.titleTypingSpeed;

    setTimeout(() => this.typeTitle(), speed);
  }

  typeInfo() {
    const phrase = this.infoPhrases[this.infoPhraseIndex];

    if (!this.infoDeleting) {
      this.infoText = phrase.substring(0, this.infoLetterIndex++);
    } else {
      this.infoText = phrase.substring(0, this.infoLetterIndex--);
    }

    this.cdr.detectChanges();

    if (!this.infoDeleting && this.infoLetterIndex === phrase.length + 1) {
      this.infoDeleting = true;
      setTimeout(() => this.typeInfo(), this.infoPauseTime);
      return;
    }

    if (this.infoDeleting && this.infoLetterIndex === 0) {
      this.infoDeleting = false;
      this.infoPhraseIndex = (this.infoPhraseIndex + 1) % this.infoPhrases.length;
    }

    const speed = this.infoDeleting ? this.infoDeletingSpeed : this.infoTypingSpeed;

    setTimeout(() => this.typeInfo(), speed);
  }
}
