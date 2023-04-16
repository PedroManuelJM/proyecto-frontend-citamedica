import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-patientdialog',
  templateUrl: './patientdialog.component.html',
  styleUrls: ['./patientdialog.component.css']
})
export class PatientdialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PatientdialogComponent>,
    private patientService: PatientService,
    private snackBar: MatSnackBar,

    ) { }


  ngOnInit(): void {

    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('' , [Validators.required, Validators.minLength(3)]),
      dni: new FormControl('', [Validators.required, Validators.minLength(8)]),
      address: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get f() {
    return this.form.controls;
  }

  close(){
    this.dialogRef.close();
  }

  operate(){

    if(this.form.invalid){
      return;
    }

    const patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    this.patientService.save(patient).pipe(switchMap(() => {
      return this.patientService.findAll();
    }))
    .subscribe(data=> {
      this.patientService.setPatientChange(data);
      this.patientService.setMessageChange('CREATED');
    });

    this.dialogRef.close(1);
  }
}
