import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Area } from 'src/app/model/area.model';
import { AreaService } from 'src/app/service/area.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-cadastrar-area',
  templateUrl: './cadastrar-area.component.html',
  styleUrls: ['./cadastrar-area.component.scss']
})
export class CadastrarAreaComponent implements OnInit {

  formularioCadastroArea!: FormGroup;
  area: Area;
  btnCadastrar = true;

  constructor(private localStorageService: LocalStorageService, private formBuilder: FormBuilder,
    private areaService: AreaService, private snackBar: MatSnackBar) { 

      this.criarFormularioCadastroArea(new Area());
  }

  ngOnInit(): void {
  }

  criarFormularioCadastroArea(area: Area){
    this.formularioCadastroArea = this.formBuilder.group({
      area: [area.area, [Validators.required]],
    })
  }

  setFormularioCadastrorArea(){
    this.formularioCadastroArea.patchValue(this.area); 
  }

  cadastrar(){
    this.area = this.formularioCadastroArea.value;
    this.areaService.cadastrarArea(this.area).subscribe(area => {

      this.showMessage('Area cadastrada com sucesso!')
      this.formularioCadastroArea.disable(); 
      this.btnCadastrar = false;
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
