import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Area } from 'src/app/model/area.model';
import { AreaService } from 'src/app/service/area.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { CustomMatPaginatorIntl } from 'src/app/utils/CustomMatPaginatorIntl';

@Component({
  selector: 'app-listar-areas',
  templateUrl: './listar-areas.component.html',
  styleUrls: ['./listar-areas.component.scss']
})
export class ListarAreasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  dataSourceArea: MatTableDataSource<Area> = new MatTableDataSource<Area>();
  dataSourceAreaFiltrado: MatTableDataSource<Area> = new MatTableDataSource<Area>();

  areas: Area[] = [];
  colunas: string[] = ['Área',' ']; 
  filtro: string = '';

  carregando = true;

  constructor(private areaService: AreaService, private localStorageService: LocalStorageService,
    private paginatorIntl: MatPaginatorIntl) { }

  ngOnInit(): void {

    this.areaService.listarAreas().subscribe( areas => {
      this.areas = areas
      this.dataSourceArea.data = this.areas;
      this.aplicarPaginacao();
    });

    this.carregando = false;
  }

  aplicarPaginacao() {
    this.paginatorIntl = new CustomMatPaginatorIntl();
    this.paginator._intl = this.paginatorIntl;

   this.dataSourceArea.paginator = this.paginator;
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

  this.dataSourceAreaFiltrado.data = this.areas.filter(area =>
    this.removerAcentos(area.area).toLowerCase().includes(filtro) 
  );

  this.dataSourceArea.data = this.dataSourceAreaFiltrado.data;

  this.aplicarPaginacao();
  if (this.paginator) {
    this.paginator.firstPage();
  }
}

  consultarArea(area: any){
    this.localStorageService.set('consultar-area', area);
  }

  cadastrarArea(){
    
  }

}
