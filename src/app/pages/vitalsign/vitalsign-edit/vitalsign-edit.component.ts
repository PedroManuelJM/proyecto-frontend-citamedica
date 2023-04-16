import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { Vitalsign } from 'src/app/model/vitalsign';
import { PatientService } from 'src/app/service/patient.service';
import { VitalsignService } from 'src/app/service/vitalsign.service';
import { PatientdialogComponent } from '../patientdialog/patientdialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vitalsign-edit',
  templateUrl: './vitalsign-edit.component.html',
  styleUrls: ['./vitalsign-edit.component.css']
})
export class VitalsignEditComponent implements OnInit {


  id: number;
  isEdit: boolean;
  form: FormGroup;
  patients$: Observable<Patient[]>;// busqueda
  maxDate: Date = new Date();

  constructor(
    private vitalsignService: VitalsignService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,

  ){}

  ngOnInit(): void {

  // trae a los pacientes
   this.getPatients();

   // validar formulario
    this.form = new FormGroup({
      idVitalSigns: new FormControl(0),
      idPatient: new FormControl('', [Validators.required]),
      vitalsigndate: new FormControl('' , [Validators.required]),
      temperature: new FormControl('', [Validators.required, Validators.minLength(2)]),
      pulse: new FormControl('',[Validators.required, Validators.minLength(2)]),
      rate: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

  }

  initForm(){
    // llena el formulario edit
    if(this.isEdit){
      this.vitalsignService.findById(this.id).subscribe(data => {

        this.form = new FormGroup({
          idVitalSigns: new FormControl(data.idVitalSigns),
          idPatient: new FormControl(data.patient.idPatient, [Validators.required]),
          vitalsigndate: new FormControl(data.vitalsigndate, [Validators.required]),
          temperature: new FormControl(data.temperature, [Validators.required, Validators.minLength(2)]),
          pulse: new FormControl(data.pulse, [Validators.required, Validators.minLength(2)]),
          rate: new FormControl(data.rate, [Validators.required, Validators.minLength(2)]),
        });

      });
    }
  }

  operate() {

    if(this.form.invalid){
      return;
    }

    const vitalsign = new Vitalsign();
    vitalsign.idVitalSigns=this.form.value['idVitalSigns'];
    vitalsign.vitalsigndate=this.form.value['vitalsigndate'];
    vitalsign.temperature=this.form.value['temperature'];
    vitalsign.pulse=this.form.value['pulse'];
    vitalsign.rate=this.form.value['rate'];

    const patient = new Patient();
    patient.idPatient=this.form.value['idPatient'];

    vitalsign.patient=patient; // igualando la variable


    if (this.isEdit) {
      // UPDATE
      this.vitalsignService.update(vitalsign, this.id).subscribe(data => {
        this.vitalsignService.findAll().subscribe(data => {
          //NEXT: ALMACENA LA DATA EN LA VARIABLE
          this.vitalsignService.setVitalSignChange(data);
          this.vitalsignService.setMessageChange("UPDATED!");
        });
      });


    }else{
      // INSERT
      this.vitalsignService.save(vitalsign).pipe(switchMap(() =>{
        return this.vitalsignService.findAll();
      }))
        .subscribe(data =>{
          this.vitalsignService.setVitalSignChange(data);
          this.vitalsignService.setMessageChange("CREATED!");
        });
    }
    this.router.navigate(['/pages/vitalsign']);
  }



  getPatients() {
    this.patients$ = this.patientService.findAll();
  }

  get f() {
    return this.form.controls;
  }


  newPatient() {

    const dialogRef = this.dialog.open(PatientdialogComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
         this.getPatients();
      }
    });
  }

}
