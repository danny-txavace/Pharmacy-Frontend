import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { ISupplierGetAllResponse } from '@frontend-pharmacy/core/lib/interfaces/i-people';
import { TooltipModule } from 'primeng/tooltip';
import { formatDateNoTime, formatDateWithTime, formatQty } from '@frontend-pharmacy/core/utils/formattings';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-card-people-supplier',
  imports: [RippleModule, DividerModule, TranslateModule, CommonModule, TooltipModule],
  templateUrl: './card-people-supplier.html',
  styleUrl: './card-people-supplier.scss',
})
export class CardPeopleSupplier {
  @Input({ required: false }) data: ISupplierGetAllResponse = {
    id: '232423423',
    fullName: 'Danny Farmaceutico, Lda',
    phoneNumber: '84 123 1233',
    address: 'Nkobe',
    type: 'Medicamentos / Cosméticos',
    createdAt: new Date,
    totalQty: 1300,
    updatedAt: new Date()
  };

  protected FormatDateNoTime = formatDateNoTime;
  protected FormatDateWithTime = formatDateWithTime;
  protected FormatQty = formatQty;
}
