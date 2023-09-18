import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Area } from 'src/app/model/area.model';
import { Professor } from 'src/app/model/professor.model';
import { AreaService } from 'src/app/service/area.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ProfessorService } from 'src/app/service/professor.service';

@Component({
  selector: 'app-perfil-professor',
  templateUrl: './perfil-professor.component.html',
  styleUrls: ['./perfil-professor.component.scss']
})
export class PerfilProfessorComponent implements OnInit {

  professor: Professor;
  professorTemp: Professor;
  usuario: any;
  formularioPerfilProfessor!: FormGroup;

  btnEditar = 'editar';

  acao: any;

  areas: Area[];

  areasSelecionadas: Area[];
  areasSelecionadasStr: string;
  
  constructor(private localStorageService: LocalStorageService,  private formBuilder: FormBuilder,
    private professorService: ProfessorService, private snackBar: MatSnackBar, 
    private areaService: AreaService) { 
    this.usuario = this.localStorageService.get('usuario');

    this.setProfessor();
  }

  ngOnInit(): void {
  }

  setProfessor(){
    this.professorService.consultarProfessorPorUsuario(this.usuario.usuario).subscribe(professor => {
      this.professor = professor;
      this.areasSelecionadas = null;
      this.criarFormularioPerfilProfessor(new Professor());
      this.setFormularioPerfilProfessor()
      this.getAreas();
    });
  }

  criarFormularioPerfilProfessor(professor: Professor){
    this.formularioPerfilProfessor = this.formBuilder.group({
      nome: [professor.nome, [Validators.required]],
      prontuario: [professor.prontuario, [Validators.required]],
      email: [professor.email, [Validators.required, Validators.email]],
      celular: [professor.celular, [Validators.required]],
      areasInteresse: [professor.areasInteresse || []],
      areaAtuacao: [professor.areaAtuacao, [Validators.required]],
      disciplinasMinistradas: [professor.disciplinasMinistradas, [Validators.required]],
      usuario: [professor.usuario, [Validators.required]],
      senha: [professor.senha, [Validators.required]]
    })
  }

  setFormularioPerfilProfessor(){
    this.formularioPerfilProfessor.patchValue(this.professor);
    this.formularioPerfilProfessor.get('areasInteresse').setValue(this.areasInteresse(this.professor.areasInteresse));
    this.areasSelecionadas = this.professor.areasInteresse;
    this.areasSelecionadasStr = this.areasInteresse(this.areasSelecionadas)
    this.formularioPerfilProfessor.disable();
  }

  editar(formulario: FormGroup<any>){
    if(this.btnEditar == 'salvar'){
      this.atualizarProfessor(formulario)
    }

    if(this.btnEditar == 'editar'){
      formulario.enable(); 
      formulario.get('prontuario').disable()
      formulario.get('usuario').disable()
      this.btnEditar = 'salvar'
    }
  }

  atualizarProfessor(formulario: FormGroup<any>){
    var professorTemp = { ...this.professor, ...formulario.value };
    professorTemp.areasInteresses = this.areasSelecionadas;
    this.areasSelecionadasStr = this.getSelectedAreas();

    this.professorService.atualizarProfessor(professorTemp).subscribe(professor =>
    {
      this.usuario = professor;
      this.professor = professor;
      this.formularioPerfilProfessor.disable();

      this.btnEditar = 'editar'
      this.showMessage('Professor atualizado com sucesso!')
    }, e => {
      this.showMessage('Houve um problema ao atualizar professor!')
    });
  }

  getSelectedAreas(): string {
    this.areasSelecionadas = this.formularioPerfilProfessor.get('areasInteresse').value || [];
    if (Array.isArray(this.areasSelecionadas)) {
      const nomesAreas = this.areasSelecionadas.map(area => area.area); // Obtém apenas os nomes das áreas selecionadas
      return nomesAreas.join(', ');
    }

    return '';
  }

  getAreas() {
    this.areaService.listarAreas().subscribe(areas => {
      this.areas = areas;
    });
  }

  compareAreas(area1: any, area2: any): boolean {
    // Compare as áreas por algum atributo exclusivo, como o ID
    return area1.id === area2.id;
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
