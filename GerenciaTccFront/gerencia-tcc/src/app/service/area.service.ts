import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Area } from '../model/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  url = "http://localhost:8090/areas"

  constructor(private http: HttpClient) { }

  consultarArea(id: String | any): Observable<Area>{
    var area = `${this.url}/${id}`;
    return this.http.get<Area>(area);
  }

  cadastrarArea(area: Area): Observable<Area>{
    return this.http.post<Area>(this.url, area);
  }

  listarAreas(): Observable<Area[]>{
    return this.http.get<Area[]>(this.url)
  }

  atualizarArea(area: Area): Observable<Area>{
    return this.http.put<Area>(`${this.url}/${area.id}`, area);
  }
}
