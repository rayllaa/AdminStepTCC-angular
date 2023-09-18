import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Aluno } from 'src/app/model/aluno.model';
import { LocalStorageService } from 'src/app/service/local-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() visivel = false;

  constructor(private router: Router, private localStorageService: LocalStorageService) {
  }

  ngOnInit() {}

  get usuario(): Aluno {
    const usuario = this.localStorageService.get('usuario');
    return usuario;
  }

  redirecionarConsultaAluno(){
    this.router.navigate(['/perfil-aluno']);
  }

  redirecionarConsultaProfessor(){
    this.router.navigate(['/perfil-professor']);
    
  }
}
