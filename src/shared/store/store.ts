import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, takeLatest } from 'redux-saga/effects';

import { applicantsReducer, applicantsActions } from '../../features/applicantsDashboard/slice';
import { handleFetchApplicants } from '../../features/applicantsDashboard/saga';
import { applicationReducer, applicationActions } from '../../features/applicationForm/slice';
import { handleSaveApplication } from '../../features/applicationForm/saga';
import { uiReducer } from './uiSlice';

const sagasToRegister = [
  { actionType: applicantsActions.fetchRequest.type, saga: handleFetchApplicants },
  { actionType: applicationActions.saveRequest.type, saga: handleSaveApplication },
];

function* rootSaga() {
  yield all(sagasToRegister.map(({ actionType, saga }) => takeLatest(actionType, saga)));
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    applicants: applicantsReducer,
    application: applicationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
