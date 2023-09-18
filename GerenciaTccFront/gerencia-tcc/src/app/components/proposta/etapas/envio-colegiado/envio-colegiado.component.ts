import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { Aluno } from 'src/app/model/aluno.model';
import { Professor } from 'src/app/model/professor.model';
import { Proposta } from 'src/app/model/proposta.model';
import { Usuario } from 'src/app/model/usuario.model';
import { FilterService } from 'src/app/service/filter.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { PropostaService } from 'src/app/service/proposta.service';

@Component({
  selector: 'app-envio-colegiado',
  templateUrl: './envio-colegiado.component.html',
  styleUrls: ['./envio-colegiado.component.scss']
})
export class EnvioColegiadoComponent implements OnInit {

  formularioEnvioProposta!: FormGroup;
  formularioStep: Proposta;
  envioProposta = false;

  btnEditarVisivel = false;
  btnCadastrarProposta = true;

  usuario: any;
  proposta = new Proposta();

  maxOptions = 4;
  btnEditar = 'editar';

  alunos: Aluno[];
  professores: Professor[];
  filtroAluno: Observable<Aluno[]>;
  filtroProfessor: Observable<Professor[]>;

  carregando = false;

  constructor(private propostaService: PropostaService, private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private localStorageService: LocalStorageService,
    private filterService: FilterService) {
    this.usuario = this.localStorageService.get('usuario');
    this.proposta = this.localStorageService.get('proposta');

    this.validarStatusProposta();
  }

  ngOnInit(): void {
    this.alunos = this.localStorageService.get('alunos');
    this.professores = this.localStorageService.get('professores');
  }

  validarStatusProposta() {
    if (this.proposta != null && this.proposta.statusEtapaEnvioProposta === true) {//Consulta
      this.carregando = true;
      this.criarFormularioEnvioProposta(new Proposta())
      this.setFormularioEnvioProposta();
      this.btnEditarVisivel = true;
    } else { //Cadastro
      //this.carregando = false;
      this.criarFormularioEnvioProposta(new Proposta())
    }
  }

  //Consulta
  setFormularioEnvioProposta() {
    this.formularioEnvioProposta.patchValue(this.proposta);
    this.formularioEnvioProposta.disable();
    this.envioProposta = true;
    this.carregando = false;
  }

  //Chama no Cadastrar
  exibirFormularioEnvioProposta() {
    this.envioProposta = true;
    this.criarFormularioEnvioProposta(new Proposta())
  }

  //Consulta e Cadastrar
  criarFormularioEnvioProposta(proposta: Proposta) {

    this.formularioEnvioProposta = this.formBuilder.group({
      numeroProcesso: [proposta.numeroProcesso, [Validators.required]],
      aluno: [proposta.aluno, [Validators.required]],
      professor: [proposta.professor, [Validators.required]],
      tema: [proposta.tema, [Validators.required]],
      dataEnvioColegiado: [proposta.dataEnvioColegiado, [Validators.required]],
      dataAvaliacaoColegiado: [proposta.dataAvaliacaoColegiado, Validators.compose([Validators.required,
      this.dateGreaterThanValidator('dataEnvioColegiado')])],
      statusParecerColegiado: [proposta.statusParecerColegiado, [Validators.required]],
      observacaoColegiado: [proposta.observacaoColegiado],
      linkAta: [proposta.linkAta]
    })

    //cadastro
    this.aplicarFiltros();
  }

  //Cadastro (ja tem que settar antes o form junto com os possiveis filtros)
  cadastrarEnvioProposta() {
    this.proposta = this.formularioEnvioProposta.value;
    this.proposta.statusEtapaEnvioProposta = true;
    this.proposta.statusProposta = 'ENVIADO AO COLEGIADO';

    this.propostaService.cadastrarProposta(this.proposta).subscribe(() => {
      this.showMessage('Cadastro realizado com sucesso!')

      // this.btnCadastrarProposta = false;
      this.btnEditarVisivel = true;
      this.formularioEnvioProposta.disable()
    }, erro => {
      this.proposta = null;
      //this.btnCadastrarProposta = true; 
      this.showMessage(erro.error.message)
    });
  }

  atualizarProposta(formulario: FormGroup<any>) {
    this.formularioStep = formulario.value;
    this.formularioStep = { ...this.proposta, ...this.formularioStep }

    this.propostaService.atualizarProposta(this.formularioStep).subscribe(() => {
      this.showMessage('Atualização realizada com sucesso!')

      this.proposta = { ...this.proposta, ...this.formularioStep }

      formulario.disable()
      this.btnEditar = 'editar'

    }, erro => {
      const errorMessage = erro.error.errors[0].defaultMessage;
      //this.showMessage(errorMessage)
      this.showMessage(erro.error.message)
    });
  }

  editar(formulario: FormGroup<any>) {
    if (this.btnEditar == 'salvar') {
      this.atualizarProposta(formulario)
    }

    if (this.btnEditar == 'editar') {
      formulario.enable()
      formulario.get('numeroProcesso').disable()
      formulario.get('aluno').disable()
      this.btnEditar = 'salvar'
    }
  }

  //Cadastro
  aplicarFiltros() {
    this.filtroAluno = this.formularioEnvioProposta.get('aluno').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filtrarAlunos(value))
    );

    this.filtroProfessor = this.formularioEnvioProposta.get('professor').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filtrarProfessores(value))
    );
  }

  filtrarAlunos(value: any): Observable<Aluno[]> {
    if (typeof value === 'string') {
      const valorFiltrado = this.filterService.removerAcentos(value.toLowerCase());
      const alunoFiltrado = this.alunos.filter(aluno =>
        this.filterService.removerAcentos(aluno.nome.toLowerCase()).includes(valorFiltrado)
      );
      return of(alunoFiltrado.slice(0, this.maxOptions));
    } else {
      return of([]);
    }
  }

  filtrarProfessores(value: any): Observable<Professor[]> {
    if (typeof value === 'string') {
      const valorFiltrado = this.filterService.removerAcentos(value.toLowerCase());
      const professorFiltrado = this.professores.filter(professor =>
        this.filterService.removerAcentos(professor.nome.toLowerCase()).includes(valorFiltrado)
      );
      return of(professorFiltrado.slice(0, this.maxOptions));
    } else {
      return of([]);
    }
  }

  displayFn(usuario: Usuario): string {
    return usuario && usuario.nome ? usuario.nome : '';
  }

  dateGreaterThanValidator(dateControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dateValue = control.value;
      const otherDateValue = control.root.get(dateControlName)?.value;

      if (dateValue && otherDateValue && new Date(dateValue) <= new Date(otherDateValue)) {
        return { dateGreaterThan: true };
      }

      return null;
    };
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
