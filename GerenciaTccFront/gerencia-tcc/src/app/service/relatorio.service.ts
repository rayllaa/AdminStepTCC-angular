import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Aluno } from '../model/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  url = "http://localhost:8090/relatorios"

  constructor( private http: HttpClient) { }

  gerarRelatorioAlunos(dados: any): Observable<Blob>{
    var url = `${this.url}/gerar/alunos`;

    return this.http.post(url, dados, { responseType: 'blob' });
  }

  gerarRelatorioProfessores(dados: any): Observable<Blob>{
    var url = `${this.url}/gerar/professores`;

    return this.http.post(url, dados, { responseType: 'blob' });
  }

  gerarRelatorioPropostas(dados: any): Observable<Blob>{
    var url = `${this.url}/gerar/propostas`;

    return this.http.post(url, dados, { responseType: 'blob' });
  }
}
