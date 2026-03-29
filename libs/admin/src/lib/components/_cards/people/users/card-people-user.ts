import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { IUserGetAllResponse } from '@frontend-pharmacy/core/lib/interfaces/i-people';
import { formatDateNoTime, formatDateWithTime } from '@frontend-pharmacy/core/utils/formattings';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-card-people-user',
  imports: [RippleModule, TranslateModule, CommonModule, TooltipModule],
  templateUrl: './card-people-user.html',
  styleUrl: './card-people-user.scss',
})
export class CardPeopleUser {
  @Input({ required: false }) data: IUserGetAllResponse = {
    id: '232423423',
    fullName: 'Ramadan Ismael',
    username: 'ramadan',
    role: 'admin',
    isActive: true,
    createdAt: new Date,
    updatedAt: new Date
  };

  protected FormatDateNoTime = formatDateNoTime;
  protected FormatDateWithTime = formatDateWithTime;
}
