import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proposta } from '../model/proposta.model';

@Injectable({
  providedIn: 'root'
})
export class PropostaService {

  url = "http://localhost:8090/propostas"

  constructor(private http: HttpClient) { }

  listarPropostas(): Observable<Proposta[]>{
    return this.http.get<Proposta[]>(this.url)
  }

  listarPropostasBanca(dataAtual: any): Observable<Proposta[]>{
    var url = `${this.url}/defesas?data_atual=${dataAtual}`;
    return this.http.get<Proposta[]>(url)
  }

  consultarPropostaPorIdAluno(idAluno: String | any): Observable<Proposta>{
    var proposta = `${this.url}/consultar?id_aluno=${idAluno}`;
    return this.http.get<Proposta>(proposta);
  }

  consultarPropostaPorIdProfessor(idProfessor: String | any): Observable<Proposta[]>{
    var proposta = `${this.url}/consultar/${idProfessor}`;
    return this.http.get<Proposta[]>(proposta);
  }

  cadastrarProposta(proposta: Proposta): Observable<Proposta>{
    return this.http.post<Proposta>(this.url, proposta);
  }

  atualizarProposta(proposta: Proposta): Observable<Proposta>{
    return this.http.patch<Proposta>(`${this.url}/${proposta.numeroProcesso}`, proposta);
  }
}
