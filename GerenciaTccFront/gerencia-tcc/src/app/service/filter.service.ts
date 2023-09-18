import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filteredOptions: any = [];

  constructor() { }

  filtro(value: any, lista: any []): any[] {

    if (!value) {
      return this.filteredOptions;
    }

    const valorFiltro = value.toLowerCase();
    return lista.filter(item => item.nome.toLowerCase().includes(valorFiltro));
  }

  filtroSelectTrigger(value: any, lista: any []): any[] {
    const valorFiltro = value.toLowerCase();
    return lista.filter(item => item.nome.toLowerCase().includes(valorFiltro));
  }

  removerAcentos(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}

  