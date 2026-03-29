import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { ICustomerGetAllResponse } from '@frontend-pharmacy/core/lib/interfaces/i-people';
import { DividerModule } from 'primeng/divider';
import { formatDateNoTime, formatDateWithTime, formatQty } from '@frontend-pharmacy/core/utils/formattings';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-card-people-customer',
  imports: [RippleModule, TranslateModule, CommonModule, DividerModule, TooltipModule],
  templateUrl: './card-people-customer.html',
  styleUrl: './card-people-customer.scss',
})
export class CardPeopleCustomer {
  @Input({ required: false }) data: ICustomerGetAllResponse = {
    id: '232423423',
    fullName: 'Ramadan Ismael',
    phoneNumber: '84 123 1233',
    address: 'Nkobe',
    createdAt: new Date,
    totalQty: 1300,
    updatedAt: new Date()
  };

  protected FormatDateNoTime = formatDateNoTime;
  protected FormatDateWithTime = formatDateWithTime;
  protected FormatQty = formatQty;
}
