import { Component, OnInit, OnChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Aluno } from "src/app/model/aluno.model";
import { EventService } from "src/app/service/event.service";

@Component({
    selector:'app-content',
    templateUrl: './content.component.html',
    styleUrls:["./content.component.scss"]
})
export class AppContent{

    visivel = true;

    aluno =  new Aluno();

    constructor(private route: ActivatedRoute, private router: Router,
      private eventService: EventService) {}

    ngOnInit(){
      // this.eventService.eventEmitter.subscribe((aluno: Aluno) => {
      //   this.aluno = aluno;
      // });  

    }
}