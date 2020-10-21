// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

// ngrx store
import { Store, select } from '@ngrx/store';
import * as fromApp from '../state/app.reducer';
import * as appActions from '../state/app.actions';

// rxjs
import { Observable } from 'rxjs';

// models
import { Question } from '../models/question';
import { FirebaseService } from '../services/firebase.service';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'assessment-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  user: any = null;
  showLoader = true;
  componentActive = true;

  constructor(private store: Store<fromApp.AppState>,
              public afAuth: AngularFireAuth) {
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    setTimeout(() => this.showLoader = false, 1000);
    this.initalizeAppData();

    this.afAuth.authState.pipe(
      takeWhile(() => this.componentActive)
    ).subscribe({
      next: (response) => {
        if (response) {
          this.store.dispatch(new appActions.SignInUser(
            {
              userId: response.uid,
              emailAddress: response.email,
              fullName: response.displayName
            }));
        } else {

        }
      }
    });

    this.store.pipe(select(fromApp.getSignedInUser),
    takeWhile(() => this.componentActive)).subscribe(
      user => {
        this.user = user;
      }
    );
  }

  initalizeAppData(): void {
    this.store.dispatch(new appActions.LoadSelfAssessmentQuestions());
    this.store.dispatch(new appActions.LoadSelfAssessmentSections());
  }

}
