import type { OnInit } from '@angular/core';
import { EventEmitter, Output, Component } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import type { UUID, Patient, PatientStatus } from 'digital-fuesim-manv-shared';
import { healthPointsDefaults, statusNames } from 'digital-fuesim-manv-shared';
import type { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import type { AppState } from 'src/app/state/app.state';
import {
    selectPretriageFlag,
    getSelectClient,
    getSelectPatient,
} from 'src/app/state/exercise/exercise.selectors';
import type { PopupComponent } from '../../utility/popup-manager';

@Component({
    selector: 'app-patient-popup',
    templateUrl: './patient-popup.component.html',
    styleUrls: ['./patient-popup.component.scss'],
})
export class PatientPopupComponent implements PopupComponent, OnInit {
    // These properties are only set after OnInit
    public patientId!: UUID;

    @Output() readonly closePopup = new EventEmitter<void>();

    public patient$?: Observable<Patient>;
    public patientStatus$?: Observable<PatientStatus>;
    public client$ = this.store.select(
        getSelectClient(this.apiService.ownClientId!)
    );

    public currentYear = new Date().getFullYear();

    public patientStatus?: PatientStatus;
    public pretriageFlag$ = this.store.select(selectPretriageFlag);

    private readonly secondsUntilRealStatus = 5;

    // To use it in the template
    public readonly healthPointsDefaults = healthPointsDefaults;

    constructor(
        private readonly store: Store<AppState>,
        private readonly apiService: ApiService
    ) {}

    ngOnInit(): void {
        this.patient$ = this.store.select(getSelectPatient(this.patientId));
        this.patientStatus$ = this.store.select(
            createSelector(
                getSelectPatient(this.patientId),
                selectPretriageFlag,
                (patient, pretriageFlag) =>
                    !pretriageFlag ||
                    patient.treatmentTime >= this.secondsUntilRealStatus
                        ? patient.realStatus
                        : patient.visibleStatus
            )
        );
    }

    setPretriageCategory(patientId: UUID, patientStatus: PatientStatus) {
        this.apiService.proposeAction({
            type: '[Patient] Set Visible Status',
            patientId,
            patientStatus,
        });
    }

    public get statusNames() {
        return statusNames;
    }
}
