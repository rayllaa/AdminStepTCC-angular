import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private localStorageService: LocalStorageService) { }

  usuario: any;

  ngOnInit(): void {
    this.getUsuarioLocalStorage();
  }

  getUsuarioLocalStorage(): any {
    this.usuario = this.localStorageService.get('usuario');
  }

}
