import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Proposta } from 'src/app/model/proposta.model';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { PropostaService } from 'src/app/service/proposta.service';
@Component({
  selector: 'app-finalizacao',
  templateUrl: './finalizacao.component.html',
  styleUrls: ['./finalizacao.component.scss']
})
export class FinalizacaoComponent implements OnInit {

  formularioFinalizacao!: FormGroup;
  formularioStep: Proposta;
  finalizacao = false;

  btnAvancarStepVisivel = false;
  btnEditarVisivel = false;
  btnCadastrarFinalizacao = true;

  usuario: any;
  proposta = new Proposta();

  btnEditar = 'editar';

  constructor(private formBuilder: FormBuilder,private propostaService: PropostaService,  
    private snackBar: MatSnackBar, private localStorageService: LocalStorageService) { 
   
    this.usuario = this.localStorageService.get('usuario');
    this.proposta = this.localStorageService.get('proposta');

    this.validarStatusProposta();
  }

  ngOnInit(): void {
   
  }

  validarStatusProposta() {
    if (this.proposta != null && this.proposta.statusEtapaFinalizacao === true) {//Consulta
      this.criarFormularioFinalizacao(new Proposta())
      this.setFormularioFinalizacao();
    } else { //Cadastro
      this.criarFormularioFinalizacao(new Proposta())
    }
  }

  //Consulta
  setFormularioFinalizacao() {
    this.formularioFinalizacao.patchValue(this.proposta);
    this.formularioFinalizacao.disable();
    this.finalizacao = true;
  }

  //Finalizacao
  exibirFormularioCadastroFinalizacao(){
    this.finalizacao = true;
    this.criarFormularioFinalizacao(new Proposta())
  }

  criarFormularioFinalizacao(proposta: Proposta){
    this.formularioFinalizacao = this.formBuilder.group({
      dataEntregaDocumentosFinais: [proposta.dataEntregaDocumentosFinais, [Validators.required]]
    })
  }

  cadastrarFinalizacao(){
    this.proposta.statusEtapaFinalizacao = true;
    this.proposta.statusProposta = 'CONCLUIDO';
    this.proposta = { ...this.proposta, ...this.formularioFinalizacao.value }

    this.propostaService.atualizarProposta(this.proposta).subscribe(() => {
      this.showMessage('Cadastro realizado com sucesso!')

      this.btnEditarVisivel = true
      this.btnAvancarStepVisivel = true
      this.btnCadastrarFinalizacao = false
      this.formularioFinalizacao.disable()
    }, erro => {
      this.showMessage('Houve um problema ao realizar cadastro!')
    });
  }

  atualizarProposta(formulario: FormGroup<any>) {
    this.formularioStep = formulario.value;
    this.formularioStep = { ...this.proposta, ...this.formularioStep }

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


  showMessage(msg: string): void{
    this.snackBar.open(msg,'X',{
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "top"
    })
  }
}
