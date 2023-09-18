import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { Professor } from 'src/app/model/professor.model';

import { Proposta } from 'src/app/model/proposta.model';
import { FilterService } from 'src/app/service/filter.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { PropostaService } from 'src/app/service/proposta.service';
@Component({
  selector: 'app-qualificacao',
  templateUrl: './qualificacao.component.html',
  styleUrls: ['./qualificacao.component.scss']
})
export class QualificacaoComponent implements OnInit {

  formularioQualificacao!: FormGroup;
  formularioStep: Proposta;
  qualificacao = false;

  btnAvancarStepVisivel = false;
  btnEditarVisivel = false;
  btnCadastrarQualificacao = true;

  usuario: any;
  proposta = new Proposta();

  btnEditar = 'editar';

  professores: Professor[];
  selectedProfessores: Professor[];
  professoresSelecionados: string;
  filtroProfessor: Observable<Professor[]>;
  nome: string;

  constructor(private formBuilder: FormBuilder, private propostaService: PropostaService,
    private snackBar: MatSnackBar, private localStorageService: LocalStorageService, private filterService: FilterService) {

    this.usuario = this.localStorageService.get('usuario');
    this.proposta = this.localStorageService.get('proposta');
    this.professores = this.localStorageService.get('professores');

    this.validarStatusProposta();
    this.aplicarFiltroBancaQualificacao();
  }

  ngOnInit(): void {
  }

  validarStatusProposta() {
    if (this.proposta != null && this.proposta.statusEtapaQualificacao === true) {//Consulta
      this.criarFormularioQualificacao(new Proposta())
      this.setFormularioQualificacao();
    } else { //Cadastro
      this.criarFormularioQualificacao(new Proposta())
    }
  }

  //Consulta
  setFormularioQualificacao() {
    if (this.proposta.integrantesBancaQualificacao){
      const values = this.proposta.integrantesBancaQualificacao.split(", ");
      this.proposta.integrantesBancaQualificacao = values;
    } 
    
    this.formularioQualificacao.patchValue(this.proposta);
    this.formularioQualificacao.disable();
    this.qualificacao = true;
  }

  get integrantesBancaQualificacao() {
    return this.formularioQualificacao.get('integrantesBancaQualificacao');
  }

  getSelectedProfessores(): string {
    this.selectedProfessores = this.formularioQualificacao.get('integrantesBancaQualificacao').value || [];
    if (Array.isArray(this.selectedProfessores)) {
      this.professoresSelecionados = this.selectedProfessores.join(', ');
      return this.professoresSelecionados;
    }
    return '';
  }

  // Qualificação
  exibirFormularioCadastroQualificacao() {
    this.qualificacao = true;
    this.criarFormularioQualificacao(new Proposta())
  }

  criarFormularioQualificacao(proposta: Proposta) {
    this.formularioQualificacao = this.formBuilder.group({
      dataQualificacao: [proposta.dataQualificacao, Validators.compose([Validators.required, this.dateGreaterThanValidator('dataInicioDesenvolvimento')])],
      horarioQualificacao: [proposta.horarioQualificacao, [Validators.required]],
      localQualificacao: [proposta.localQualificacao, [Validators.required]],
      integrantesBancaQualificacao: [proposta.integrantesBancaQualificacao || [], [Validators.required]],
      modalidadeQualificacao: [proposta.modalidadeQualificacao, [Validators.required]],
      statusParecerQualificacao: [proposta.statusParecerQualificacao]
    })
  }

  cadastrarQualificacao() {
    this.proposta.statusEtapaQualificacao = true;
    this.proposta.statusProposta = 'EM QUALIFICACAO';
    this.proposta = { ...this.proposta, ...this.formularioQualificacao.value }
    this.proposta.integrantesBancaQualificacao = this.professoresSelecionados;

    this.propostaService.atualizarProposta(this.proposta).subscribe(() => {
      this.showMessage('Cadastro realizado com sucesso!')

      this.btnEditarVisivel = true
      this.btnAvancarStepVisivel = true
      this.btnCadastrarQualificacao = false
      this.formularioQualificacao.disable();
    }, erro => {
      this.showMessage('Houve um problema ao realizar cadastro!')
    });
  }

  atualizarProposta(formulario: FormGroup<any>) {
    this.formularioStep = formulario.value;
    this.formularioStep = { ...this.proposta, ...this.formularioStep }
    this.formularioStep.integrantesBancaQualificacao = this.professoresSelecionados;

    this.propostaService.atualizarProposta(this.formularioStep).subscribe(() => {
      this.showMessage('Atualização realizada com sucesso!')

      this.proposta = { ...this.proposta, ...this.formularioStep }

      formulario.disable()
      this.btnEditarVisivel = true
      this.btnEditar = 'editar'
    }, erro => {
      this.showMessage('Houve um problema ao realizar atualizacao!')
    });
  }

  editar(formulario: FormGroup<any>) {
    if (this.btnEditar == 'salvar') {
      this.atualizarProposta(formulario)
    }

    if (this.btnEditar == 'editar') {
      formulario.enable()
      this.btnEditar = 'salvar'
    }
  }

  aplicarFiltroBancaQualificacao(){
    this.filtroProfessor = this.formularioQualificacao.get('integrantesBancaQualificacao').valueChanges.pipe(
      startWith(''),
      map(value => this.filterService.filtroSelectTrigger(value, this.professores))
    );
  }

  compareProfessores(professor1: Professor, professor2: Professor): boolean {
    return professor1 && professor2 ? professor1.nome === professor2.nome : professor1 === professor2;
  }

  // displayFn(professor: Professor): string {
  //   return professor && professor.nome ? professor.nome : '';
  // }

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

  captureWords(value: string) {
    var palavras = value.split(' ');

    if (palavras.length > 0) {
      this.nome = palavras[0].concat(' ', palavras[1]);
    }
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
