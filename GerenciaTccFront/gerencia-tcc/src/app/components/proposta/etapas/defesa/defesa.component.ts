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
  selector: 'app-defesa',
  templateUrl: './defesa.component.html',
  styleUrls: ['./defesa.component.scss']
})
export class DefesaComponent implements OnInit {

  formularioDefesa!: FormGroup;
  formularioStep: Proposta;
  defesa = false;

  btnAvancarStepVisivel = false;
  btnEditarVisivel = false;
  btnCadastrarDefesa = true;

  usuario: any;
  proposta = new Proposta();

  btnEditar = 'editar';

  professores: Professor[];
  selectedProfessores: Professor[];
  professoresSelecionados: string;
  filtroProfessor: Observable<Professor[]>;

  constructor(private formBuilder: FormBuilder, private propostaService: PropostaService, 
    private snackBar: MatSnackBar, private localStorageService: LocalStorageService, private filterService: FilterService) {

    this.usuario = this.localStorageService.get('usuario');
    this.proposta = this.localStorageService.get('proposta');
    this.professores = this.localStorageService.get('professores');

    this.validarStatusProposta();
    this.aplicarFiltroBancaDefesa();
  }

  ngOnInit(): void {
  }

  validarStatusProposta() {
    if (this.proposta != null && this.proposta.statusEtapaDefesa === true) {//Consulta
      this.criarFormularioDefesa(new Proposta())
      this.setFormularioDefesa();
    } else { //Cadastro
      this.criarFormularioDefesa(new Proposta())
    }
  }

  //Consulta
  setFormularioDefesa() {
    if (this.proposta.integrantesBancaQualificacao){
      const values = this.proposta.integrantesBancaDefesa.split(", ");
      this.proposta.integrantesBancaDefesa = values;
    } 
    
    this.formularioDefesa.patchValue(this.proposta);
    this.formularioDefesa.disable();
    this.defesa = true;
  }

  get integrantesBancaDefesa() {
    return this.formularioDefesa.get('integrantesBancaDefesa');
  }

  concatenaArrayEmString(value: any){
    const values = value.join(", ");

    return values
  }

  getSelectedProfessores(): string {
    this.selectedProfessores = this.formularioDefesa.get('integrantesBancaDefesa').value || [];
    if (Array.isArray(this.selectedProfessores)) {
      this.professoresSelecionados = this.selectedProfessores.join(', ');
      return this.professoresSelecionados;
    }
    return '';
  }

  //Defesa
  exibirFormularioCadastroDefesa() {
    this.defesa = true;
    this.criarFormularioDefesa(new Proposta())
  }

  criarFormularioDefesa(proposta: Proposta) {
    this.formularioDefesa = this.formBuilder.group({
      dataDefesa: [proposta.dataDefesa, [Validators.required]],
      horarioDefesa: [proposta.horarioDefesa, [Validators.required]],
      localDefesa: [proposta.localDefesa, [Validators.required]],
      integrantesBancaDefesa: [proposta.integrantesBancaDefesa || [], [Validators.required]],
      modalidadeDefesa: [proposta.modalidadeDefesa, [Validators.required]],
      statusParecerDefesa: [proposta.statusParecerDefesa]
    })
  }

  cadastrarDefesa() {
    this.proposta.statusEtapaDefesa = true;
    this.proposta.statusProposta = 'EM DEFESA';
    this.proposta = { ...this.proposta, ...this.formularioDefesa.value }
    this.proposta.integrantesBancaDefesa = this.professoresSelecionados;

    this.propostaService.atualizarProposta(this.proposta).subscribe(() => {
      this.showMessage('Cadastro realizado com sucesso!')

      this.btnEditarVisivel = true
      this.btnCadastrarDefesa = false
      this.formularioDefesa.disable()
    }, erro => {
      this.showMessage('Houve um problema ao realizar cadastro!')
    });
  }

  atualizarProposta(formulario: FormGroup<any>) {
    this.formularioStep = formulario.value;
    this.formularioStep = { ...this.proposta, ...this.formularioStep }
    this.formularioStep.integrantesBancaDefesa = this.professoresSelecionados;

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

  aplicarFiltroBancaDefesa(){
    this.filtroProfessor = this.formularioDefesa.get('integrantesBancaDefesa').valueChanges.pipe(
      startWith(''),
      map(value => this.filterService.filtroSelectTrigger(value, this.professores))
    );
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
