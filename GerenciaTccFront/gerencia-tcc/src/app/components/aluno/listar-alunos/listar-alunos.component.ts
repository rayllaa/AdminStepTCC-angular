import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError } from 'rxjs/operators';
import { Aluno } from 'src/app/model/aluno.model';
import { AlunoService } from 'src/app/service/aluno.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { PropostaService } from 'src/app/service/proposta.service';
import { RelatorioService } from 'src/app/service/relatorio.service';
import { CustomMatPaginatorIntl } from 'src/app/utils/CustomMatPaginatorIntl';

@Component({
  selector: 'app-listar-alunos',
  templateUrl: './listar-alunos.component.html',
  styleUrls: ['./listar-alunos.component.scss']
})
export class ListarAlunosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSourceAluno: MatTableDataSource<Aluno> = new MatTableDataSource<Aluno>();
  dataSourceAlunoFiltrado: MatTableDataSource<Aluno> = new MatTableDataSource<Aluno>();

  colunas: string[] = ['Prontuário', 'Nome', 'Curso', 'Áreas de Interesse', 'Semestre Atual', 'Ano de Ingresso', 'Status Proposta', ' '];
  alunos: Aluno[] = [];
  filtro: string = '';

  filtros: string[] = ['Prontuário', 'Nome', 'Curso', 'Áreas de Interesse', 'Semestre Atual', 'Ano de Ingresso', 'Status Proposta'];
  filtrosSelecionados: string[] = [];

  carregando = false;

  constructor(private alunoService: AlunoService, private paginatorIntl: MatPaginatorIntl,
    private relatorioService: RelatorioService, private propostaService: PropostaService,
    private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.carregando = true;
    this.alunoService.listarAlunos().subscribe(alunos => {
      this.alunos = alunos;
      this.dataSourceAluno.data = this.alunos;
      this.dataSourceAlunoFiltrado.data = this.alunos;
      this.carregando = false;
      this.obterProposta();
      this.aplicarPaginacao();
      this.aplicarFiltro();
    })
  }

  obterProposta() {
    for (const aluno of this.alunos) {
      this.propostaService.consultarPropostaPorIdAluno(aluno.id).pipe(
        catchError(() => {
          aluno.statusProposta = 'NÃO SUBMETIDA';
          return EMPTY;
        })
      )
        .subscribe(proposta => {
          if (proposta != null) {
            aluno.statusProposta = proposta.statusProposta
          }
        });
    }
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
    this.dataSourceAluno.paginator = this.paginator;
  }

  onPageChange(event: PageEvent) {
    this.aplicarPaginacao();
  }

  removerAcentos(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  aplicarFiltro() {
    const filtroSemAcento = this.removerAcentos(this.filtro.trim().toLowerCase());
    const filtro = filtroSemAcento;

    this.dataSourceAlunoFiltrado.data = this.alunos.filter(aluno => {
      const prontuarioMatch = this.removerAcentos(aluno.prontuario).toLowerCase().includes(filtro);
      const nomeMatch = this.removerAcentos(aluno.nome).toLowerCase().includes(filtro);
      const cursoMatch = this.removerAcentos(aluno.curso.nome).toLowerCase().includes(filtro);
      const areasInteresseMatch = this.removerAcentos(this.areasInteresse(aluno.areasInteresse)).toLowerCase().includes(filtro);
      const semestreAtualMatch = this.removerAcentos(aluno.semestreAtual).toLowerCase().includes(filtro);
      const anoIngressoMatch = this.removerAcentos(aluno.anoIngresso).toLowerCase().includes(filtro);
      const statusPropostaMatch = this.removerAcentos(aluno.statusProposta).toLowerCase().includes(filtro);

      if (this.filtrosSelecionados.length === 0) {
        // Nenhum filtro selecionado, filtrar por todos os campos da tabela
        return (
          prontuarioMatch ||
          nomeMatch ||
          cursoMatch ||
          areasInteresseMatch ||
          semestreAtualMatch ||
          anoIngressoMatch ||
          statusPropostaMatch
        );
      } else {
        // Pelo menos um filtro selecionado, verificar correspondência
        return (
          (this.filtrosSelecionados.includes('Prontuário') && prontuarioMatch) ||
          (this.filtrosSelecionados.includes('Nome') && nomeMatch) ||
          (this.filtrosSelecionados.includes('Curso') && cursoMatch) ||
          (this.filtrosSelecionados.includes('Áreas de Interesse') && areasInteresseMatch) ||
          (this.filtrosSelecionados.includes('Semestre Atual') && semestreAtualMatch) ||
          (this.filtrosSelecionados.includes('Ano de Ingresso') && anoIngressoMatch) ||
          (this.filtrosSelecionados.includes('Status Proposta') && statusPropostaMatch)
        );
      }
    });

    this.dataSourceAluno.data = this.dataSourceAlunoFiltrado.data;
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

  gerarRelatorio() {
    this.relatorioService.gerarRelatorioAlunos(this.dataSourceAlunoFiltrado.data)
      .subscribe(response => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');

        link.href = url;

        link.setAttribute('download', 'relatorio-alunos.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  consultarAluno(aluno: any) {
    this.localStorageService.set('consultar-aluno', aluno);
  }

  consultarPropostaAluno(aluno: any) {
    this.propostaService.consultarPropostaPorIdAluno(aluno.id).pipe(
      catchError(() => {
        return EMPTY;
      })
    )
      .subscribe(proposta => {
        if (proposta != null) {
          this.localStorageService.remove('acao');
          this.localStorageService.set('acao', 'LISTAR');
          this.localStorageService.set('proposta', proposta);
        }
      });
  }
}
