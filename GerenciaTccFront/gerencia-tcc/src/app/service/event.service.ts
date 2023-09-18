import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Aluno } from '../model/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  //public eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  public event = new Subject<Aluno>();

  emitirEvento(aluno: Aluno) {
    this.event.next(aluno);
  }
}