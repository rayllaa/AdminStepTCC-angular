import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Curso } from 'src/app/model/curso.model';
import { CursoService } from 'src/app/service/curso.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { CustomMatPaginatorIntl } from 'src/app/utils/CustomMatPaginatorIntl';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-listar-cursos',
  templateUrl: './listar-cursos.component.html',
  styleUrls: ['./listar-cursos.component.scss']
})
export class ListarCursosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSourceCurso: MatTableDataSource<Curso> = new MatTableDataSource<Curso>();
  dataSourceCursoFiltrado: MatTableDataSource<Curso> = new MatTableDataSource<Curso>();

  cursos: Curso[] = [];
  colunas: string[] = ['Curso', 'Instituição', ' '];
  filtro: string = '';

  carregando = true;

  constructor(private cursoService: CursoService, private localStorageService: LocalStorageService,
    private paginatorIntl: MatPaginatorIntl, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCursos();
    this.carregando = false;
  }

  getCursos(){
    this.cursoService.listarCursos().subscribe(curso => {
      this.cursos = curso

      this.cursos.forEach((c) => { //mapear logo pra cada curso
        this.cursoService.getLogo(c.id).subscribe( imgBytes => {
          var imageSrc = `data:image/jpeg;base64,${this.arrayBufferToBase64(imgBytes)}`;
          c.logo = imageSrc;
        });
      })

      this.dataSourceCurso.data = this.cursos;
      this.aplicarPaginacao();
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = new Uint8Array(buffer);
    const bytes = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
    return btoa(bytes);
}

  aplicarPaginacao() {
    this.paginatorIntl = new CustomMatPaginatorIntl();
    this.paginator._intl = this.paginatorIntl;

    this.dataSourceCurso.paginator = this.paginator;
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
    const filtro = this.removerAcentos(this.filtro.trim().toLowerCase());

    this.dataSourceCursoFiltrado.data = this.cursos.filter(curso =>
      this.removerAcentos(curso.nome).toLowerCase().includes(filtro) || 
      this.removerAcentos(curso.instituicao).toLowerCase().includes(filtro)
    );

    this.dataSourceCurso.data = this.dataSourceCursoFiltrado.data;

    this.aplicarPaginacao();
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  consultarCurso(curso: any) {
    this.localStorageService.set('consultar-curso', curso);
  }

  excluirCurso(curso: Curso) {
    this.cursoService.excluirCurso(curso).subscribe(curso => {
      this.showMessage('Curso excluído com sucesso!')
      //this.removerCursoExcluido(curso.id);
      window.location.reload();
      this.dataSourceCurso.data = this.cursos;
    }, e => {
      this.showMessage('Houve um problema ao excluir curso!')
    });

  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}

