import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Professor } from 'src/app/model/professor.model';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ProfessorService } from 'src/app/service/professor.service';

@Component({
  selector: 'app-consultar-professor',
  templateUrl: './consultar-professor.component.html',
  styleUrls: ['./consultar-professor.component.scss']
})
export class ConsultarProfessorComponent implements OnInit {

  professor: Professor;
  usuario: any;
  formularioConsultaProfessor!: FormGroup;

  btnEditar = 'editar';
  exibirBtn = false;

  acao: any;

  areasSelecionadasStr: string;
  
  constructor(private localStorageService: LocalStorageService,  private formBuilder: FormBuilder,
    private professorService: ProfessorService, private snackBar: MatSnackBar) { 
    this.usuario = this.localStorageService.get('usuario');
    this.professor = this.localStorageService.get('consultar-professor');
    this.criarFormularioConsultaProfessor(new Professor());
    this.setFormularioConsultarProfessor()
  }

  ngOnInit(): void {
  }


  criarFormularioConsultaProfessor(aluno: Professor){
    this.formularioConsultaProfessor = this.formBuilder.group({
      nome: [aluno.nome, [Validators.required]],
      prontuario: [aluno.prontuario, [Validators.required]],
      email: [aluno.email, [Validators.required, Validators.email]],
      celular: [aluno.celular, [Validators.required]],
      areasInteresse: [aluno.areasInteresse],
      areaAtuacao: [aluno.areaAtuacao, [Validators.required]],
      disciplinasMinistradas: [aluno.disciplinasMinistradas, [Validators.required]],
      usuario: [aluno.usuario, [Validators.required]],
      senha: [aluno.senha, [Validators.required]]
    })
  }

  setFormularioConsultarProfessor(){
    this.formularioConsultaProfessor.patchValue(this.professor); 
    this.areasSelecionadasStr = this.areasInteresse(this.professor.areasInteresse);
    this.formularioConsultaProfessor.disable(); 
  }

  atualizarProfessor(formulario: FormGroup<any>){
    var professor = { ...this.professor, ...formulario.value };
    this.professorService.atualizarProfessor(professor).subscribe(professor =>
    {
      this.professor = professor;
      this.formularioConsultaProfessor.disable();
      this.btnEditar = 'editar'
      this.showMessage('Professor atualizado com sucesso!')
    }, e => {
      this.showMessage('Houve um problema ao atualizar professor!')
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
