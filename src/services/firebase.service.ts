// angular
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../environments/environment';
import { v4 as uuidv4 } from 'uuid';

// rxjs
import { Observable, from } from 'rxjs';
import { map, tap, take, switchMap, mergeMap, expand, takeWhile } from 'rxjs/operators';

// Models
// import { Payment } from '../models/payment/payment';
import { Section } from '../models/section';
import { Question } from 'src/models/question';

@Injectable()
export class FirebaseService {

constructor(private afs: AngularFirestore,
            private afstorage: AngularFireStorage) {
}

getSelfAssessmentQuestions(): Observable<Question[]> {
  return this.afs.collection('/questions', ref => ref.orderBy('orderBy')).snapshotChanges().pipe(
    map(q => {
      const data: Question[] = [];
      q.forEach(x => {
        const item = x.payload.doc.data() as Question;
        item.questionId = x.payload.doc.id;
        data.push(item);
      });
      return data;
    })
  );
}

getSelfAssessmentSections(): Observable<Section[]> {
  return this.afs.collection('/sections', ref => ref.orderBy('orderBy')).snapshotChanges().pipe(
    map(q => {
      const data: Section[] = [];
      q.forEach(x => {
        const item = x.payload.doc.data() as Section;
        item.sectionId = x.payload.doc.id;
        data.push(item);
      });
      return data;
    })
  );
}

createQuestions(): void {
}

createSelfAssessment(obj): any {
  // atomic transaction
  const selfAssessmentId = uuidv4();
  const batch = this.afs.firestore.batch();

  const saRef = this.afs.collection('/self-assessments').doc(selfAssessmentId).ref;
  batch.set(saRef, {
    createdAt: new Date().toLocaleDateString(),
    selfUserId: obj.userId,
    questionAnswers: obj.questionAnswers,
    contacts: obj.contacts});

  obj.contacts.forEach(element => {
    if (element.emailAddress) {
      const peerAssessmentId = uuidv4();
      const peerRef = this.afs.collection('/peer-assessments').doc(peerAssessmentId).ref;
      batch.set(peerRef, {
        selfAssessmentId,
        fullName: element.fullName,
        emailAddress: element.emailAddress,
        createdAt: new Date().toLocaleDateString(),
        completed: false,
        selfUserId: obj.userId,
        linkToAssessment: this.getPeerAssessmentUrlBase() + peerAssessmentId
      });
    }
  });

  return from(batch.commit());
}

getPeerAssessmentUrlBase(): string {
  return !environment.production ? 'localhost:4200/peerassessment/' : 'selfassessment.firebaseapp/peerassessment/';
}

/*
  getPlants() {
    return this.afs.collection('/plants').snapshotChanges();
  }

  getMyPlants(uid: string) {
    return this.afs.collection('/plants', ref => ref.where('uid' , '==', uid)).valueChanges();
  }

  uploadImage(file, filename) {
    const storageRef = this.afstorage.ref(filename);
    const task = storageRef.put(file);
  }

  getImageURL(filename) {
    const storageRef = this.afstorage.ref(filename);
    const URL = storageRef.getDownloadURL();
    return URL;
  }
  */
}
