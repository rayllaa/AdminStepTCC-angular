import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-aplicacao',
  templateUrl: './aplicacao.component.html',
  styleUrls: ['./aplicacao.component.scss']
})
export class AplicacaoComponent implements OnInit {

  usuario = new Usuario();

  home = true;
  proposta = false;
  professores = false;

  constructor(private route: ActivatedRoute, private router: Router, 
    private localStorageService: LocalStorageService ) {}

  ngOnInit(): void {
    this.getLocalStorage();
  }

  getLocalStorage() {
      this.usuario = this.localStorageService.get('usuario');
  }

  logoff(){
    this.localStorageService.clear();
  }
}
