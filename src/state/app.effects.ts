import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FirebaseService } from '../services/firebase.service';
import * as appActions from './app.actions';
import { mergeMap, map } from 'rxjs/operators';
import { Question } from '../models/question';
import { Section } from '../models/section';
import { pipe } from 'rxjs';

@Injectable()
export class AppEffects {

    constructor(private actions$: Actions,
                private firebase: FirebaseService) {
    }

    @Effect()
    loadSelfAssesementQuestions$ = this.actions$.pipe(
        ofType(appActions.AppActionTypes.LoadSelfAssessmentQuestions),
        mergeMap((action: appActions.LoadSelfAssessmentQuestions) => this.firebase.getSelfAssessmentQuestions().pipe(
            map((questions: Question[]) => (new appActions.LoadSelfAssessmentQuestionsSuccess(questions)))
        ))
    );

    @Effect()
    loadSelfAssesementSections$ = this.actions$.pipe(
        ofType(appActions.AppActionTypes.LoadSelfAssessmentSections),
        mergeMap((action: appActions.LoadSelfAssessmentSections) => this.firebase.getSelfAssessmentSections().pipe(
            map((Sections: Section[]) => (new appActions.LoadSelfAssessmentSectionsSuccess(Sections)))
        ))
    );

    @Effect()
    createSelfAssessment$ = this.actions$.pipe(
        ofType(appActions.AppActionTypes.CreateSelfAssessment),
        mergeMap((action: appActions.CreateSelfAssessment) => this.firebase.createSelfAssessment(action.payload).pipe(
            map(res => new appActions.CreateSelfAssessmentSuccess(true))
        ))
    );

    // @Effect()
    // createSelfAssessment$ = this.actions$.pipe(
    //     ofType(appActions.AppActionTypes.CreateSelfAssessment),
    //     mergeMap((action: appActions.CreateSelfAssessment) => this.firebase.createSelfAssessment(action.payload)
    //     .then(res =>
    //         {
    //             console.log(res);
    //             new appActions.CreateSelfAssessmentSuccess(true)
    //         })
    //     .catch(err => new appActions.CreateSelfAssessmentError()))
    // );
}
