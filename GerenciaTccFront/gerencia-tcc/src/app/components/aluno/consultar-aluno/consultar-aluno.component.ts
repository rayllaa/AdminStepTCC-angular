import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError } from 'rxjs/operators';
import { Aluno } from 'src/app/model/aluno.model';
import { AlunoService } from 'src/app/service/aluno.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { PropostaService } from 'src/app/service/proposta.service';

@Component({
  selector: 'app-consultar-aluno',
  templateUrl: './consultar-aluno.component.html',
  styleUrls: ['./consultar-aluno.component.scss']
})
export class ConsultarAlunoComponent implements OnInit {

  aluno: Aluno;
  usuario: any;
  formularioConsultaAluno!: FormGroup;
  
  btnEditar = 'editar';

  areasSelecionadasStr: string;

  constructor(private localStorageService: LocalStorageService, private alunoService: AlunoService,
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private propostaService: PropostaService) { 
    this.usuario = this.localStorageService.get('usuario');
    this.setAluno();
    this.criarFormulario(new Aluno());
    this.setFormularioConsultarAluno()
  }

  ngOnInit(): void {
  }

  setAluno(){
    if(this.usuario.cargo == 'PROFESSOR' || this.usuario.cargo == 'COORDENADOR'){
      this.aluno = this.localStorageService.get('consultar-aluno');
    }
    if(this.usuario.cargo == 'ALUNO'){
      this.aluno = this.usuario;
    }

    this.areasSelecionadasStr = this.areasInteresse(this.aluno.areasInteresse);

    var curso = this.aluno.curso.nome
    this.aluno.nomeCurso = curso;
  }

  criarFormulario(aluno: Aluno){
    this.formularioConsultaAluno = this.formBuilder.group({
      nome: [aluno.nome, [Validators.required]],
      prontuario: [aluno.prontuario, [Validators.required]],
      email: [aluno.email, [Validators.required, Validators.email]],
      celular: [aluno.celular, [Validators.required]],
      curso: [aluno.curso, [Validators.required]],
      anoIngresso: [aluno.anoIngresso, [Validators.required, Validators.min(2012), Validators.max(2023)]],
      semestreAtual: [aluno.semestreAtual, [Validators.required, Validators.min(1), Validators.max(20)]],
      areasInteresse: [aluno.areasInteresse],
      usuario: [aluno.usuario, [Validators.required]],
      senha: [aluno.senha, [Validators.required]]
    })
  }

  setFormularioConsultarAluno(){
    this.formularioConsultaAluno.patchValue(this.aluno); 
    this.formularioConsultaAluno.get('curso').setValue(this.aluno.curso.nome);
    this.formularioConsultaAluno.disable(); 
  }

  consultarProposta(){
    this.propostaService.consultarPropostaPorIdAluno(this.aluno.id).pipe(
      catchError(() => {
        return EMPTY; 
      })
    )
    .subscribe(proposta => {
      if(proposta != null){
        this.localStorageService.set('acao', 'LISTAR');
        this.localStorageService.set('proposta', proposta);
      }
    });
  }

  areasInteresse(areas: any[]): string {
    if (Array.isArray(areas)) {
      const nomesAreas = areas.map(area => area.area);
      return nomesAreas.join(', ');
    }
    return '';
  }

  showMessage(msg: string): void{
    this.snackBar.open(msg,'X',{
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "top"
    })
  }
}
