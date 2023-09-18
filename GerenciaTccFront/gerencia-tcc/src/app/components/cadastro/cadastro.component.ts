import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio'
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Aluno } from 'src/app/model/aluno.model';
import { Area } from 'src/app/model/area.model';
import { Curso } from 'src/app/model/curso.model';
import { AlunoService } from 'src/app/service/aluno.service';
import { AreaService } from 'src/app/service/area.service';
import { CursoService } from 'src/app/service/curso.service';
import { FilterService } from 'src/app/service/filter.service';
import { ProfessorService } from 'src/app/service/professor.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  @ViewChild('nomeCurso') nomeCurso: ElementRef;

  formularioCadastro!: FormGroup;

  matcher = new ErrorStateMatcher();
  cursos: Curso[];
  areas: Area[];

  filtroCurso: Observable<Curso[]>;
  filtroArea: Observable<Area[]>;

  selectedAreas: Area[];
  areasSelecionadas: string;

  cargoSelecionado: string = 'ALUNO';

  constructor(private router: Router, private formBuilder: FormBuilder, private alunoService: AlunoService, private professorService: ProfessorService, 
    private snackBar: MatSnackBar, private cursoService: CursoService, private areaService: AreaService,
     private filterService: FilterService) { 
      this.getCursos();
      this.getAreas();    
      this.criarFormulario(new Aluno());
    }

    ngOnInit(): void {
    }

  getCursos(){
    this.cursoService.listarCursos().subscribe(cursos => {
      this.cursos = cursos;
    });
  }

  getAreas(){
    this.areaService.listarAreas().subscribe(areas => {
      this.areas = areas;
    });
  }

  get areasInteresse() {
    return this.formularioCadastro.get('areasInteresse');
  }


  criarFormulario(usuario: any){
    this.formularioCadastro = this.formBuilder.group({
      cargo: [this.cargoSelecionado, [Validators.required]],
      nome: [usuario.nome, [Validators.required]],
      prontuario: [usuario.prontuario, [Validators.required]],
      email: [usuario.email, [Validators.required, Validators.email]],
      celular: [usuario.celular, [Validators.required]],
      curso: [usuario.curso, [Validators.required]],
      anoIngresso: [usuario.anoIngresso, [Validators.required, Validators.min(2012), Validators.max(2023)]],
      semestreAtual: [usuario.semestreAtual, [Validators.required, Validators.min(1), Validators.max(20)]],
      areaAtuacao: [usuario.areaAtuacao, [Validators.required]],
      disciplinasMinistradas: [usuario.disciplinasMinistradas, [Validators.required]],
      areasInteresse: [usuario.areasInteresse || []],
      usuario: [usuario.usuario, [Validators.required]],
      senha: [usuario.senha, [Validators.required]]
    })

    this.aplicarFiltros();
  }

  cadastro() {
    this.cadastrar(this.formularioCadastro.value);
  }

  cadastrar(usuario: any){

    usuario.areasInteresse = this.selectedAreas;
    console.log(usuario)

    if(usuario.cargo === 'ALUNO'){
      let aluno = usuario as Aluno
      this.alunoService.cadastrarAluno(aluno).subscribe(() => {
        this.showMessage('Aluno salvo com sucesso!')
        this.router.navigate(['/'])
      }, erro => {
        //confirm("Houve um problema ao realizar o cadastro do aluno " + aluno.nome + "Deseja tentar novamente?")
        this.showMessage(erro.error.message)
      });
    }

    if(usuario.cargo === 'PROFESSOR'){
      this.professorService.cadastrarProfessor(usuario).subscribe(() => {
        this.showMessage('Professor salvo com sucesso!')
        this.router.navigate(['/'])
      }, erro => {
        this.showMessage(erro.error.message)
      });
    }
   
  }

  limparFormulario() {
    this.formularioCadastro.reset();
  }

  aplicarFiltros(){
    this.filtroCurso = this.formularioCadastro.get('curso').valueChanges.pipe(
      startWith(''),
      map(value => this.filterService.filtro(value, this.cursos).slice(0, 4))
    );
  }

  displayFn(curso: Curso): string {
    return curso && curso.nome ? curso.nome : '';
  }

  displayFnArea(area: any): string {
    return area && area.area ? area.area : '';
  }

  nomeAreasInteresse(areas: any[]): string {
    if (Array.isArray(areas)) {
      const nomesAreas = areas.map(area => area.area);
      return nomesAreas.join(', ');
    }
    return '';
  }

  getSelectedAreas(): string {
    this.selectedAreas = this.formularioCadastro.get('areasInteresse').value || [];

    if (Array.isArray(this.selectedAreas)) {
      this.areasSelecionadas = this.nomeAreasInteresse(this.selectedAreas);
      return this.areasSelecionadas;
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