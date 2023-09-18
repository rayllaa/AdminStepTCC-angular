import { CommonModule } from '@angular/common';
import { ListarProfessoresTesteComponent } from './listar-professores/listar-professores.component';
import { NgModule } from '@angular/core';


@NgModule({
    declarations: [ListarProfessoresTesteComponent],
    imports: [
       CommonModule],
       exports:[ListarProfessoresTesteComponent]
})
export class ProfessorModule { }
