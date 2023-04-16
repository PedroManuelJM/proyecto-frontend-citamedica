import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit{

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'dni', 'actions'];
  dataSource: MatTableDataSource<Patient>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar
    ){

  }

  ngOnInit(): void {

    //RECUPERAR LOS DATOS DE LA VARIABLE REACTIVA
    //SE INVOCA SOLO CUANDO SE DETECTA UN NEXT
    this.patientService.getPatientChange().subscribe(data => {
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });

    this.patientService.listPageable(0, 4).subscribe(data => {
      this.createTable(data);
    });

    /*this.patientService.findAll().subscribe(data => {
      this.createTable(data);
    });*/
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  createTable(data: any){
    this.dataSource = new MatTableDataSource(data.content);
    this.totalElements = data.totalElements;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;

  }

  delete(idPatient: number){
    this.patientService.delete(idPatient).pipe(switchMap( ()=>{
      return this.patientService.findAll();
    }))
    .subscribe(data => {
      this.patientService.setPatientChange(data);
      this.patientService.setMessageChange("DELETED!");
    });
    ;
  }

  showMore(e: any){
    this.patientService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.createTable(data);
    });
  }


}
