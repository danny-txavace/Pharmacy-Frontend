import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18nRepository } from '@frontend-pharmacy/core/lib/repositories/i18n-repository';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-layout-license-device-success',
  imports: [],
  templateUrl: './layout-license-device-success.html',
  styleUrl: './layout-license-device-success.scss',
})
export class LayoutLicenseDeviceSuccess implements OnInit, OnDestroy {
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

  ngOnInit(): void {
    this.titlePhrases = [
      'Verificação Concluída!',
      'Código Confirmado!'
    ]

    this.typeTitle();

    setTimeout(() => {
      const auth = `/${this.i18nRep.getLang()}/auth/sign-in`;
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
}
