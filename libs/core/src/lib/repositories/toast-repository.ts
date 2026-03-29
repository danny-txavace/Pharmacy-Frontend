import { inject, Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastRepository {
  private readonly msgService = inject(MessageService);
  private readonly zone = inject(NgZone);
  private readonly translateService = inject(TranslateService);

  onShowMsg(severity: string, message: string, life?: number): void
  {
    if (life == null)
    {
      life = 10000;
    }

    const detail = this.onMsgTranslated(message);
    const summary = this.onMsgTranslated(severity);

    // Impede que o Angular faça change detection
    this.zone.runOutsideAngular(() => {
      this.msgService.add({
        severity,
        summary,
        detail,
        life
      });
    });
  }

  private onMsgTranslated(value: string): string
  {
    let msg = '';

    if (value === 'info')
    { msg = 'MESSAGE_TOAST.INFO.SUMMARY'; }
    else if (value === 'success')
    { msg = 'MESSAGE_TOAST.SUCCESS.SUMMARY'; }
    else if (value === 'warn')
    { msg = 'MESSAGE_TOAST.WARN.SUMMARY'; }
    else if (value === 'error')
    { msg = 'MESSAGE_TOAST.ERROR.SUMMARY'; }
    else if (value === 'secondary')
    { msg = 'MESSAGE_TOAST.SECONDARY.SUMMARY'; }
    else if (value === 'contrast')
    { msg = 'MESSAGE_TOAST.CONTRAST.SUMMARY'; }
    else
    { msg = value; }

    return this.translateService.instant(msg);
  }
}
