import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.sass'
})

export class ContactsComponent implements OnDestroy, OnInit {

  destroy$: Subject<void> = new Subject();
  loaded: boolean = false;
  rows: contact[] = [];

  constructor(private loader: LoaderService) {}

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  ngOnInit(): void {
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
    });
  }

}
