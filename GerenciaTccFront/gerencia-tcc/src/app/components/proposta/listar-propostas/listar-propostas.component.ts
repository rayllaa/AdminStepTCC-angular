import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Proposta } from 'src/app/model/proposta.model';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { PropostaService } from 'src/app/service/proposta.service';
import { RelatorioService } from 'src/app/service/relatorio.service';
import { CustomMatPaginatorIntl } from 'src/app/utils/CustomMatPaginatorIntl';

@Component({
  selector: 'app-listar-propostas',
  templateUrl: './listar-propostas.component.html',
  styleUrls: ['./listar-propostas.component.scss']
})
export class ListarPropostasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  dataSourceProposta: MatTableDataSource<Proposta> = new MatTableDataSource<Proposta>();
  dataSourcePropostaFiltrada: MatTableDataSource<Proposta> = new MatTableDataSource<Proposta>();
  
  carregando = false;

  colunas: string[] = ['Numero Processo', 'Aluno', 'Professor', 'Tema','Curso', 'Status', ' '];
  propostas: Proposta[] = [];
  filtro: string = ''; // Filtro de pesquisa

  filtros: string[] = ['Numero Processo', 'Aluno', 'Professor', 'Tema', 'Curso', 'Status'];
  filtrosSelecionados: string[] = [];

  constructor(private propostaService: PropostaService, private localStorageService: LocalStorageService, 
    private paginatorIntl: MatPaginatorIntl, private relatorioService: RelatorioService) {
  }

  ngOnInit(): void {
    this.localStorageService.set('acao', 'LISTAR');
    this.carregando = true;
    this.propostaService.listarPropostas().subscribe(propostas => {
      this.propostas = propostas;
      this.dataSourceProposta.data = this.propostas;
      this.carregando = false;
      //this.aplicarStatus();
      this.aplicarPaginacao();
      this.aplicarFiltro();
    })

  }

  aplicarStatus(){

    this.propostas.filter(proposta => {

      if (proposta != null || proposta.statusEtapaEnvioProposta){
        if(proposta.statusEtapaFinalizacao){
          proposta.statusProposta = 'CONCLUIDO';
        } else if(proposta.statusEtapaDefesa){
          proposta.statusProposta = 'EM DEFESA';
        } else if(proposta.statusEtapaQualificacao){
          proposta.statusProposta = 'EM QUALIFICACAO';
        }else if(proposta.statusEtapaDesenvolvimento){
          proposta.statusProposta = 'EM DESENVOLVIMENTO';
        }else if(proposta.statusEtapaEnvioProposta){
          proposta.statusProposta = 'ENVIADO AO COLEGIADO';
        }
      }
    })
  }

  aplicarPaginacao() {
     this.paginatorIntl = new CustomMatPaginatorIntl();
     this.paginator._intl = this.paginatorIntl;

    this.dataSourceProposta.paginator = this.paginator;
  }

  onPageChange(event: PageEvent) {
    this.aplicarPaginacao(); // Aplicar o paginator novamente ao alterar a página
  }

  removerAcentos(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  aplicarFiltro() {
    const filtro = this.removerAcentos(this.filtro.trim().toLowerCase());
    
    this.dataSourcePropostaFiltrada.data = this.propostas.filter(proposta => {
      const numeroProcessoMatch = this.removerAcentos(proposta.numeroProcesso).toLowerCase().includes(filtro);
      const alunoMatch = this.removerAcentos(proposta.aluno.nome).toLowerCase().includes(filtro);
      const professorMatch = this.removerAcentos(proposta.professor.nome).toLowerCase().includes(filtro);
      const temaMatch = this.removerAcentos(proposta.tema).toLowerCase().includes(filtro);
      const cursoMatch = this.removerAcentos(proposta.aluno.curso.nome).toLowerCase().includes(filtro);
      const statusMatch = this.removerAcentos(proposta.statusProposta).toLowerCase().includes(filtro);
  
      if (this.filtrosSelecionados.length === 0) {
        // Nenhum filtro selecionado, filtrar por todos os campos da tabela
        return (
          numeroProcessoMatch ||
          alunoMatch ||
          professorMatch ||
          temaMatch ||
          cursoMatch ||
          statusMatch
        );
      } else {
        // Pelo menos um filtro selecionado, verificar correspondência
        return (
          (this.filtrosSelecionados.includes('Numero Processo') && numeroProcessoMatch) ||
          (this.filtrosSelecionados.includes('Aluno') && alunoMatch) ||
          (this.filtrosSelecionados.includes('Professor') && professorMatch) ||
          (this.filtrosSelecionados.includes('Tema') && temaMatch) ||
          (this.filtrosSelecionados.includes('Curso') && cursoMatch) ||
          (this.filtrosSelecionados.includes('Status') && statusMatch)
        );
      }
    });
  
    this.dataSourceProposta.data = this.dataSourcePropostaFiltrada.data;
    this.aplicarPaginacao();
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  toggleFiltro(filtro: string) {
    const index = this.filtrosSelecionados.indexOf(filtro);
    if (index === -1) {
      this.filtrosSelecionados.push(filtro); // Adiciona o filtro selecionado
    } else {
      this.filtrosSelecionados.splice(index, 1); // Remove o filtro selecionado
    }

    this.aplicarFiltro()
  }

  consultarProposta(proposta: any) {
    this.localStorageService.remove('acao');
    this.localStorageService.set('acao', 'LISTAR');
    this.localStorageService.set('proposta', proposta);
  }

  cadastrarProposta() {
    this.localStorageService.remove('acao');
    this.localStorageService.set('acao', 'CADASTRAR');
  }

  gerarRelatorio(){
    this.relatorioService.gerarRelatorioPropostas(this.dataSourcePropostaFiltrada.data)
    .subscribe(response => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');

      link.href = url;
      
      link.setAttribute('download', 'relatorio-propostas.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
