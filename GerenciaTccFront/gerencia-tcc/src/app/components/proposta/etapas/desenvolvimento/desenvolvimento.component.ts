import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Proposta } from 'src/app/model/proposta.model';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { PropostaService } from 'src/app/service/proposta.service';

@Component({
  selector: 'app-desenvolvimento',
  templateUrl: './desenvolvimento.component.html',
  styleUrls: ['./desenvolvimento.component.scss']
})
export class DesenvolvimentoComponent implements OnInit {

  formularioDesenvolvimento!: FormGroup;
  formularioStep: Proposta;
  tccEmAndamento = false;

  btnAvancarStepVisivel = false;
  btnEditarVisivel = false;
  btnCadastrarDesenvolvimento = true;

  usuario: any;
  proposta = new Proposta();

  btnEditar = 'editar';

  constructor(private formBuilder: FormBuilder, private propostaService: PropostaService,
    private snackBar: MatSnackBar, private localStorageService: LocalStorageService) {

    this.usuario = this.localStorageService.get('usuario');
    this.proposta = this.localStorageService.get('proposta');

    this.validarStatusProposta();
  }

  ngOnInit(): void {
  }

  validarStatusProposta() {
    if (this.proposta != null && this.proposta.statusEtapaDesenvolvimento === true) {//Consulta
      this.criarFormularioDesenvolvimento(new Proposta())
      this.setFormularioDesenvolvimento();
    } else { //Cadastro
      this.criarFormularioDesenvolvimento(new Proposta())
    }
  }

  //Consulta
  setFormularioDesenvolvimento() {
    this.formularioDesenvolvimento.patchValue(this.proposta);
    this.formularioDesenvolvimento.disable();
    this.tccEmAndamento = true;
  }

  //Desenvolvimento
  exibirFormularioCadastroDesenvolvimento() {
    this.tccEmAndamento = true;
    this.criarFormularioDesenvolvimento(new Proposta())
  }

  criarFormularioDesenvolvimento(proposta: Proposta) {
    this.formularioDesenvolvimento = this.formBuilder.group({
      dataInicioDesenvolvimento: [proposta.dataInicioDesenvolvimento, [Validators.required]],
      dataFinalDesenvolvimento: [proposta.dataFinalDesenvolvimento, Validators.compose([Validators.required, this.dateGreaterThanValidator('dataInicioDesenvolvimento')])],
    })
  }

  cadastrarDesenvolvimento() {
    this.proposta.statusEtapaDesenvolvimento = true;
    this.proposta.statusProposta = 'EM DESENVOLVIMENTO';
    this.proposta = { ...this.proposta, ...this.formularioDesenvolvimento.value }

    this.propostaService.atualizarProposta(this.proposta).subscribe(() => {
      this.showMessage('Desenvolvimento registrado com sucesso!')

      this.btnAvancarStepVisivel = true
      this.btnCadastrarDesenvolvimento = false
      this.formularioDesenvolvimento.disable()
    }, erro => {
      this.showMessage('Houve um problema ao registrar desenvolvimento do TCC!')
    });
  }

  atualizarProposta(formulario: FormGroup<any>) {
    this.formularioStep = formulario.value;
    this.formularioStep = { ...this.proposta, ...this.formularioStep }

    this.propostaService.atualizarProposta(this.formularioStep).subscribe(() => {
      this.showMessage('Atualização realizada com sucesso!')

      formulario.disable()
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
