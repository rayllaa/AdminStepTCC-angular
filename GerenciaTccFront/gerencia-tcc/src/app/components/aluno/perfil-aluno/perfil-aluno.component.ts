import { Usuario } from './../../../model/usuario.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Aluno } from 'src/app/model/aluno.model';
import { Area } from 'src/app/model/area.model';
import { AlunoService } from 'src/app/service/aluno.service';
import { AreaService } from 'src/app/service/area.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-perfil-aluno',
  templateUrl: './perfil-aluno.component.html',
  styleUrls: ['./perfil-aluno.component.scss']
})
export class PerfilAlunoComponent implements OnInit {

  aluno: Aluno;
  alunoTemp: Aluno;
  usuario: any;
  formularioPerfilAluno!: FormGroup;

  btnEditar = 'editar';

  areas: Area[];
  areasSelecionadas: Area[];
  areasSelecionadasStr: string;

  constructor(private localStorageService: LocalStorageService, private alunoService: AlunoService,
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private areaService: AreaService) {
    this.usuario = this.localStorageService.get('usuario');
   
    this.setAluno();
  }

  ngOnInit(): void {
  }

  setAluno(){
    this.alunoService.consultarAlunoPorUsuario(this.usuario.usuario).subscribe(aluno => {
      this.aluno = aluno;
      this.areasSelecionadas = null;
      this.criarFormulario(new Aluno());
      this.setFormularioPerfilAluno()
      this.getAreas();
    });
  }

  criarFormulario(aluno: Aluno) {
    this.formularioPerfilAluno = this.formBuilder.group({
      nome: [aluno.nome, [Validators.required]],
      prontuario: [aluno.prontuario, [Validators.required]],
      email: [aluno.email, [Validators.required, Validators.email]],
      celular: [aluno.celular, [Validators.required]],
      curso: [aluno.curso, [Validators.required]],
      anoIngresso: [aluno.anoIngresso, [Validators.required, Validators.min(2012), Validators.max(2023)]],
      semestreAtual: [aluno.semestreAtual, [Validators.required, Validators.min(1), Validators.max(20)]],
      areasInteresse: [aluno.areasInteresse || []],
      usuario: [aluno.usuario, [Validators.required]],
      senha: [aluno.senha, [Validators.required]]
    })
  }

  setFormularioPerfilAluno() {
    this.formularioPerfilAluno.patchValue(this.aluno);
    this.formularioPerfilAluno.get('areasInteresse').setValue(this.areasInteresse(this.aluno.areasInteresse));
    this.formularioPerfilAluno.get('curso').setValue(this.aluno.curso.nome);   
    this.areasSelecionadas = this.aluno.areasInteresse;
    this.areasSelecionadasStr = this.areasInteresse(this.areasSelecionadas);
    this.formularioPerfilAluno.disable();
  }

  editar(formulario: FormGroup<any>) {//edição
    if (this.btnEditar == 'salvar') {
      this.atualizarAluno(formulario);
    }
  
    if (this.btnEditar == 'editar') {//visualizar
      formulario.enable();
      formulario.get('prontuario').disable();
      this.btnEditar = 'salvar';
    }
  }

  atualizarAluno(formulario: FormGroup<any>) {
    this.alunoTemp = { ...this.aluno, ...formulario.value };
    this.alunoTemp.curso = this.aluno.curso;
    this.alunoTemp.areasInteresse = this.areasSelecionadas;
    this.areasSelecionadasStr = this.areasInteresse(this.areasSelecionadas)
    
    this.alunoService.atualizarAluno(this.alunoTemp).subscribe(aluno => {
      this.usuario = aluno;
      this.aluno = aluno;
      this.formularioPerfilAluno.disable();
      
      this.btnEditar = 'editar'
      this.showMessage('Aluno atualizado com sucesso!')
    }, e => {
      this.showMessage('Houve um problema ao atualizar aluno!')
    });
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

  getSelectedAreas(): string {
    this.areasSelecionadas = this.formularioPerfilAluno.get('areasInteresse').value || [];
    if (Array.isArray(this.areasSelecionadas)) {
      const nomesAreas = this.areasSelecionadas.map(area => area.area); // Obtém apenas os nomes das áreas selecionadas
      return nomesAreas.join(', ');
    }

    return '';
  }

  formatarAreasInteresse(areas: Area[]): string {
    if (Array.isArray(areas)) {
        return areas.map(area => area.area).join(', ');
    }
    return '';
}

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
