import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Proposta } from 'src/app/model/proposta.model';
import { Usuario } from 'src/app/model/usuario.model';
import { AlunoService } from 'src/app/service/aluno.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ProfessorService } from 'src/app/service/professor.service';
import { PropostaService } from 'src/app/service/proposta.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  colunas: string[] = ['Data', 'Tema', 'Local']; // 'Orientando', 'Orientador'

  formulario!: FormGroup;
  visivel = false;
  usuario: any;

  propostas: Proposta[];
  propostasFiltradas: Proposta[];
  
  constructor(private alunoService: AlunoService, private professorService: ProfessorService, private propostaService: PropostaService,
    private router: Router, private formBuilder: FormBuilder, private snackBar: MatSnackBar, 
    private localStorageService: LocalStorageService) { 

      this.getPropostas();
    }

  ngOnInit(): void {
    this.criarFormularioLogin(new Usuario())
  }

  getPropostas(){
    const dataHoje = this.obterDataAtual();
    console.log(dataHoje)

    this.propostaService.listarPropostasBanca(dataHoje).subscribe(propostas => {
      //this.propostasFiltradas = []
      this.propostasFiltradas = propostas;
      console.log(this.propostasFiltradas)

      this.propostasFiltradas.forEach((proposta) => {
        if(proposta.dataDefesa != null){
            proposta.dataBanca = this.converterData(proposta.dataDefesa)
            proposta.local = proposta.localDefesa
          }else if(proposta.dataQualificacao != null){
            proposta.dataBanca = this.converterData(proposta.dataQualificacao)
            proposta.local = proposta.localQualificacao
          }
      });
    });

    // this.propostaService.listarPropostas().subscribe( propostas => {
    //     this.propostas = propostas;
    //     this.propostasFiltradas = []
        
    //     this.propostas.forEach((proposta) => {
    //         if(proposta.dataDefesa != null && this.compararDatas(dataHoje, proposta.dataDefesa) == -1){
    //           proposta.dataBanca = this.formatarData(proposta.dataDefesa);
    //           proposta.local = proposta.localDefesa
    //           this.propostasFiltradas.push(proposta)
    //           console.log(this.propostasFiltradas)
    //         }else if(proposta.dataQualificacao != null && this.compararDatas(dataHoje, proposta.dataQualificacao) == -1){
    //           proposta.dataBanca = this.formatarData(proposta.dataQualificacao);
    //           proposta.local = proposta.localQualificacao
    //           this.propostasFiltradas.push(proposta)
    //         }
    //     })
    // })
  }

  obterDataAtual(): string {
    const dataDeHoje = new Date();
    const ano = dataDeHoje.getFullYear().toString().padStart(4, '0'); // Obtém o ano atual com 4 dígitos
    const mes = (dataDeHoje.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês atual com 2 dígitos
    const dia = dataDeHoje.getDate().toString().padStart(2, '0'); // Obtém o dia do mês atual com 2 dígitos
  
    return `${ano}-${mes}-${dia}`;
  }

  converterData(dataString: string): string {
    const partes = dataString.split('-');
      const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
  
    return dataFormatada;
  }

  compararDatas(data1: string, data2: string): number {
    const date1 = new Date(data1);
    const date2 = new Date(data2);
  
    if (date1 < date2) {
      return -1; // data1 é anterior a data2
    } else if (date1 > date2) {
      return 1; // data1 é posterior a data2
    } else {
      return -1; // datas são iguais
    }
  }

  criarFormularioLogin(usuario: Usuario){
    this.formulario = this.formBuilder.group({
      usuario: new FormControl(usuario.usuario, [Validators.required]),
      senha: new FormControl(usuario.senha, [Validators.required])
    });
  }

  login(){
    this.usuario = this.formulario.value;

    this.alunoService.consultarAlunoPorUsuario(this.usuario.usuario)
    .subscribe(aluno => {
      this.validarCredenciaisLogin(aluno);      
    }, e => {
      this.professorService.consultarProfessorPorUsuario(this.usuario.usuario)
      .subscribe(professor => {
        this.validarCredenciaisLogin(professor);  
      }, e => {
        this.showMessage("Dados de login incorretos!");
      });
    });
  }

  validarCredenciaisLogin(usuario: any){
    if(this.usuario.senha === usuario.senha){
      this.usuario = usuario;
      this.addLocalStorage();
      this.router.navigate(['/home']);
    }else{
      this.showMessage("Dados de login incorretos!");
    }
  }

  showMessage(msg: string): void{
    this.snackBar.open(msg,'X',{
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "top"
    })
  }

  addLocalStorage() {
      this.localStorageService.set('usuario', this.usuario);
  }
}
