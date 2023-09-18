import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Professor } from 'src/app/model/professor.model';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ProfessorService } from 'src/app/service/professor.service';
import { RelatorioService } from 'src/app/service/relatorio.service';
import { CustomMatPaginatorIntl } from 'src/app/utils/CustomMatPaginatorIntl';


@Component({
  selector: 'app-listar-professores',
  templateUrl: './listar-professores.component.html',
  styleUrls: ['./listar-professores.component.scss']
})
export class ListarProfessoresComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  dataSourceProfessor: MatTableDataSource<Professor> = new MatTableDataSource<Professor>();
  dataSourceProfessorFiltrado: MatTableDataSource<Professor> = new MatTableDataSource<Professor>();

  colunas: string[] = ['Nome', 'E-mail', 'Áreas de Interesse', 'Área de Atuação',' ']; //'Áreas de Interesse',
  professores: Professor[] = [];
  filtro: string = '';

  filtros: string[] = ['Nome', 'E-mail', 'Áreas de Interesse', 'Área de Atuação'];
  filtrosSelecionados: string[] = [];

  carregando = false;

  constructor(private professorService: ProfessorService, private paginatorIntl: MatPaginatorIntl,
    private relatorioService: RelatorioService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.carregando = true;
    this.professorService.listarProfessores().subscribe(professores => {
      this.professores = professores;
      this.dataSourceProfessor.data = this.professores;
      this.dataSourceProfessorFiltrado.data = this.professores;
      this.carregando = false;
      this.aplicarPaginacao();
      this.aplicarFiltro();
    })
    
  }

  areasInteresse(areas: any[]): string {
    if (Array.isArray(areas)) {
      const nomesAreas = areas.map(area => area.area);
      return nomesAreas.join(', ');
    }
    return '';
  }

  aplicarPaginacao() {
     this.paginatorIntl = new CustomMatPaginatorIntl();
     this.paginator._intl = this.paginatorIntl;

    this.dataSourceProfessor.paginator = this.paginator;
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
    
    this.dataSourceProfessorFiltrado.data = this.professores.filter(professor => {
      const nomeMatch = this.removerAcentos(professor.nome).toLowerCase().includes(filtro);
      const emailMatch = this.removerAcentos(professor.email).toLowerCase().includes(filtro);
      const areasInteresseMatch = this.removerAcentos(this.areasInteresse(professor.areasInteresse)).toLowerCase().includes(filtro);
      const areaAtuacaoMatch = this.removerAcentos(professor.areaAtuacao).toLowerCase().includes(filtro);
  
      if (this.filtrosSelecionados.length === 0) {
        // Nenhum filtro selecionado, filtrar por todos os campos da tabela
        return (
          nomeMatch ||
          emailMatch ||
          areasInteresseMatch ||
          areaAtuacaoMatch
        );
      } else {
        // Pelo menos um filtro selecionado, verificar correspondência
        return (
          (this.filtrosSelecionados.includes('Nome') && nomeMatch) ||
          (this.filtrosSelecionados.includes('E-mail') && emailMatch) ||
          (this.filtrosSelecionados.includes('Áreas de Interesse') && areasInteresseMatch) ||
          (this.filtrosSelecionados.includes('Área de Atuação') && areaAtuacaoMatch)
        );
      }
    });
  
    this.dataSourceProfessor.data = this.dataSourceProfessorFiltrado.data;
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

  gerarRelatorio(){
    this.relatorioService.gerarRelatorioProfessores(this.dataSourceProfessorFiltrado.data)
    .subscribe(response => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');

      link.href = url;
      
      link.setAttribute('download', 'relatorio-professores.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  consultarProfessor(professor: any){
    this.localStorageService.set('consultar-professor', professor);
  }
}
