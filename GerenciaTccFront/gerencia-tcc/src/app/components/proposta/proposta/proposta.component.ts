import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Aluno } from 'src/app/model/aluno.model';
import { Professor } from 'src/app/model/professor.model';
import { Proposta } from 'src/app/model/proposta.model';
import { AlunoService } from 'src/app/service/aluno.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ProfessorService } from 'src/app/service/professor.service';
import { PropostaService } from 'src/app/service/proposta.service';
 
@Component({
  selector: 'app-proposta',
  templateUrl: './proposta.component.html',
  styleUrls: ['./proposta.component.scss']
})
export class PropostaComponent implements OnInit {

  carregando = false;
  usuario: any;
  proposta = new Proposta();
  propostas = new Array();
  aluno = new Aluno();

  formularioEnvioProposta!: FormGroup;
  formularioDesenvolvimento!: FormGroup;
  formularioQualificacao!: FormGroup;
  formularioDefesa!: FormGroup;
  formularioEncerramento!: FormGroup;

  alunos: Aluno[];
  professores: Professor[];

  constructor(private propostaService: PropostaService, private localStorageService: LocalStorageService,
    private alunoService: AlunoService, private professorService: ProfessorService) { 

    this.usuario = this.localStorageService.get('usuario');
    this.getListasFiltroAunoProfessor();

    var acao = this.localStorageService.get('acao');

    if(acao == 'LISTAR' || this.usuario.cargo == 'ALUNO'){ //quando for cadastrar ou consultar aluno da lista ja carrregada n precisa
      this.carregando = true;
      this.getPropostaUsuario();
    }else if(acao == 'CADASTRAR'){
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.localStorageService.remove('proposta');
  }

  getListasFiltroAunoProfessor(){
    this.alunoService.listarAlunos().subscribe(alunos => {
      this.alunos = alunos;
      this.localStorageService.set('alunos', alunos);
    })

    this.professorService.listarProfessores().subscribe(professores => {
      this.professores = professores;
      this.localStorageService.set('professores', professores);
    })    
  }

  getPropostaUsuario(){
    if(this.usuario.cargo == 'ALUNO'){
      this.propostaService.consultarPropostaPorIdAluno(this.usuario.id).subscribe(proposta => {        
        this.proposta = proposta;
        this.localStorageService.set("proposta", proposta);
        this.carregando = false;
      }, erro => {
        this.carregando = false;
      })
    }

    if(this.usuario.cargo == 'PROFESSOR' || this.usuario.cargo == 'COORDENADOR'){
      this.carregando = false;
      // this.propostaService.consultarPropostaPorIdProfessor(this.usuario.id).subscribe(propostas => {
      //   this.propostas = propostas;
      //   this.localStorageService.set("propostas", propostas);

      //   console.log(propostas)
      //   this.carregando = false;
      // }, erro => {
      //   this.carregando = false;
      // })
    }

    //TODO: Condição para mostrar todas as propostas
    //TODO: condição exibir proposta do usuario

  }

  setProposta(proposta: Proposta){
    this.proposta = proposta;
    this.localStorageService.set("proposta", proposta);
  }
}
