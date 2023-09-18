import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Area } from 'src/app/model/area.model';
import { AreaService } from 'src/app/service/area.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-consultar-area',
  templateUrl: './consultar-area.component.html',
  styleUrls: ['./consultar-area.component.scss']
})
export class ConsultarAreaComponent implements OnInit {

  formularioConsultaArea!: FormGroup;
  area: Area;
  
  btnEditar = 'editar';
  
  constructor(private localStorageService: LocalStorageService, private formBuilder: FormBuilder,
    private areaService: AreaService, private snackBar: MatSnackBar) { 
    this.area = this.localStorageService.get('consultar-area');
    this.criarFormularioConsultaArea(new Area());
    this.setFormularioConsultarArea();
  }

  ngOnInit(): void {
  }

  criarFormularioConsultaArea(area: Area){
    this.formularioConsultaArea = this.formBuilder.group({
      id: [area.id, [Validators.required]],
      area: [area.area, [Validators.required]],
    })
  }

  setFormularioConsultarArea(){
    this.formularioConsultaArea.patchValue(this.area); 
    this.formularioConsultaArea.disable(); 
  }

  editar(formulario: FormGroup<any>){
    if(this.btnEditar == 'salvar'){
      this.atualizarArea(formulario)
    }

    if(this.btnEditar == 'editar'){
      formulario.enable(); 
      formulario.get('id').disable()
      this.btnEditar = 'salvar'
    }
  }

  atualizarArea(formulario: FormGroup<any>){
    var area = { ...this.area, ...formulario.value };
    this.areaService.atualizarArea(area).subscribe(area =>
    {
      this.area = area;
      this.formularioConsultaArea.disable();
      this.btnEditar = 'editar'
      this.showMessage('Area atualizado com sucesso!')
    }, erro => {
      this.showMessage(erro.error.message)
    });
  }

  showMessage(msg: string): void{
    this.snackBar.open(msg,'X',{
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "top"
    })
  }

}
