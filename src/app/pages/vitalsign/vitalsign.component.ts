import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vitalsign } from 'src/app/model/vitalsign';
import { VitalsignService } from 'src/app/service/vitalsign.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vitalsign',
  templateUrl: './vitalsign.component.html',
  styleUrls: ['./vitalsign.component.css']
})
export class VitalsignComponent implements OnInit{


  displayedColumns: string[] = ['id', 'firstName' ,'vitalsigndate', 'temperature', 'pulse', 'rate','actions'];
  dataSource: MatTableDataSource<Vitalsign>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private vitalsignService: VitalsignService,
    private _snackBar: MatSnackBar
    ){

  }

  ngOnInit(): void {
    // TRAE TODO LA INFO
    this.vitalsignService.findAll().subscribe(data => {
      this.createTable(data);
      console.log(data)
    });


    this.vitalsignService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });

    // cuando se crea un nuevo dato aparezca en la tabla
    this.vitalsignService.getVitalSignChange().subscribe(data => {
      this.createTable(data);
    });


  }

  createTable(vitalsigns: Vitalsign[]) {
    this.dataSource = new MatTableDataSource(vitalsigns);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // para filtrar por nombre del paciente
    this.dataSource.filterPredicate = (data, filter) => {
      return (data.patient.lastName).toLowerCase().includes(filter) || (data.patient.firstName).toLowerCase().includes(filter);
    }
  }

  /*
  createTable(signs: any) {
    this.dataSource = new MatTableDataSource(signs.content);
  //  this.totalElements = signs.totalElements;
    this.dataSource.filterPredicate = (data, filter) => {
      return (data.patient.lastName).toLowerCase().includes(filter) || (data.patient.firstName).toLowerCase().includes(filter);
    }
  }*/

  delete(idVitalSigns: number){
    this.vitalsignService.delete(idVitalSigns).pipe(switchMap( ()=>{
      return this.vitalsignService.findAll();
    }))
    .subscribe(data => {
      this.vitalsignService.setVitalSignChange(data);
      this.vitalsignService.setMessageChange("DELETED!");
    });
    ;
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
    console.log(this.dataSource.filter)
  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }



}
