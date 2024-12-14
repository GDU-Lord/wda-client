import { Component, inject, makeStateKey, OnDestroy, OnInit, PLATFORM_ID, TransferState } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const CONTACTS_KEY = makeStateKey<ContactsComponent["rows"]>('contacts');

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.sass'
})

export class ContactsComponent implements OnDestroy, OnInit {

  private destroy$: Subject<void> = new Subject();

  public loaded: boolean = false;
  public rows: contact[] = [];

  private isBrowser: boolean;

  constructor(private loader: LoaderService, private transferState: TransferState) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    const d = this.transferState.get(CONTACTS_KEY, null);
    if(d == null) return this.loadContacts();
    this.rows = d;
    this.loaded = true;
  }

  loadContacts(): void {
    this.loaded = false;
    this.loader.loadContacts().pipe(takeUntil(this.destroy$)).subscribe(({data: {contacts}}) => {
      this.rows = contacts.split('\n').map((str): contact => {
        let type: contact[0] = 'text';
        if(str.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/g) != null)
          type = 'email';
        if(str.match(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/g) != null)
          type = 'link';
        if(str.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g) != null)
          type = 'phone';
        return [type, str];
      });
      this.loaded = true;
      this.transferState.set(CONTACTS_KEY, this.rows);
    });
  }

}
