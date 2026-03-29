import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IUserGetAllResponse } from '@frontend-pharmacy/core/lib/interfaces/i-people';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { CardPeopleUser } from "../../../components/_cards/people/users/card-people-user";

@Component({
  selector: 'lib-people-users',
  imports: [RippleModule, TranslateModule, CardPeopleUser],
  templateUrl: './people-users.html',
  styleUrl: './people-users.scss',
})
export class PeopleUsers implements OnInit, OnDestroy {
  private readonly subs = new Subscription();
  protected isLoading = signal<boolean>(true);
  protected searchInput = '';

  items: IUserGetAllResponse[] = [];

  ngOnInit(): void {
    this.loadingData();
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }

  loadingData(): void {
    console.log('Hello friend')
  }
}
