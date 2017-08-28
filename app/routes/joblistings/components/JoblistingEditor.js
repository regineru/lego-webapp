// @flow

import React from 'react';
import styles from './JoblistingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, change } from 'redux-form';
import { Form, SelectInput } from 'app/components/Form';
import Button from 'app/components/Button';
import moment from 'moment';
import config from 'app/config';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import {
  DatePickerComponent,
  YearPickerComponent,
  FieldComponent,
  TextEditorComponent
} from './JoblistingEditorItems';

type Props = {
  joblistingId?: string,
  joblisting?: Object,
  handleSubmit: () => void,
  autocomplete: () => void,
  searching: boolean,
  submitJoblisting: () => void,
  fetchCompany: () => void,
  company?: Object,
  autocompleteResults: Array,
  dispatch: () => void,
  isNew: boolean
};

function JoblistingEditor({
  handleSubmit,
  autocompleteResults,
  joblistingId,
  joblisting,
  autocomplete,
  searching,
  isNew,
  submitJoblisting,
  company,
  fetchCompany,
  dispatch
}: Props) {
  const places = [
    { label: 'Oslo', value: 'Oslo' },
    { label: 'Bergen', value: 'Bergen' },
    { label: 'Stavanger', value: 'Stavanger' },
    { label: 'Trondheim', value: 'Trondheim' },
    { label: 'Drammen', value: 'Drammen' },
    { label: 'Fredrikstad', value: 'Fredrikstad' },
    { label: 'Sarpsborg', value: 'Sarpsborg' },
    { label: 'Kristiansand', value: 'Kristiansand' },
    { label: 'Ålesund', value: 'Ålesund' },
    { label: 'Tønsberg', value: 'Tønsberg' },
    { label: 'Moss', value: 'Moss' },
    { label: 'Haugesund', value: 'Haugesund' },
    { label: 'Sandefjord', value: 'Sandefjord' },
    { label: 'Arendal', value: 'Arendal' },
    { label: 'Bodø', value: 'Bodø' },
    { label: 'Tromsø', value: 'Tromsø' },
    { label: 'Hamar', value: 'Hamar' },
    { label: 'Larvik', value: 'Larvik' },
    { label: 'Kongsberg', value: 'Kongsberg' },
    { label: 'Molde', value: 'Molde' },
    { label: 'Lillehammer', value: 'Lillehammer' },
    { label: 'Drøbak', value: 'Drøbak' },
    { label: 'Hønefoss', value: 'Hønefoss' },
    { label: 'Elverum', value: 'Elverum' },
    { label: 'Kongsvinger', value: 'Kongsvinger' }
  ];

  if (isNew && !joblisting) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = newJoblisting => {
    const workplaces = newJoblisting.workplaces
      ? newJoblisting.workplaces.map(obj => ({ town: obj.value }))
      : null;
    const responsible = newJoblisting.responsible
      ? newJoblisting.responsible
      : null;
    const responsibleId =
      newJoblisting.responsible && newJoblisting.responsible !== -1
        ? responsible
        : null;

    submitJoblisting({
      ...newJoblisting,
      workplaces,
      responsible: responsibleId
    });
  };

  if (!isNew && !joblisting.company.id) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>
        {!isNew ? 'Rediger jobbannonse' : 'Legg til jobbannonse'}
      </h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FieldComponent text="Tittel: " name="title" placeholder="Tittel" />
        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Bedrift: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Bedrift'}
              name="company"
              component={SelectInput.Field}
              options={autocompleteResults}
              fetching={searching}
              onSearch={query => autocomplete(query, ['companies.company'])}
              onChange={() =>
                dispatch(
                  change('joblistingEditor', 'responsible', {
                    label: 'Ingen',
                    value: -1
                  })
                )}
            />
          </FlexColumn>
        </FlexRow>

        <DatePickerComponent text="Deadline:" name="deadline" />
        <DatePickerComponent text="Synlig fra:" name="visibleFrom" />
        <DatePickerComponent text="Synlig til:" name="visibleTo" />

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Jobbtype: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field name="jobType" component="select">
              <option value="summer_job">Sommerjobb</option>
              <option value="part_time">Deltid</option>
              <option value="full_time">Fulltid</option>
            </Field>
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Arbeidssteder: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Arbeidssteder'}
              name="workplaces"
              component={SelectInput.Field}
              options={places}
              tags
            />
          </FlexColumn>
        </FlexRow>

        <YearPickerComponent text="Fra år: " name="fromYear" />
        <YearPickerComponent text="Til år: " name="toYear" />

        <FieldComponent
          text="Søknadslenke: "
          name="applicationUrl"
          placeholder="Søknadslenke"
        />

        <TextEditorComponent
          text="Søknadsintro: "
          name="description"
          placeholder="Søknadsintro"
        />
        <TextEditorComponent
          text="Søknadstekst: "
          name="text"
          placeholder="Søknadstekst"
        />

        <FlexRow className={styles.row}>
          <FlexColumn className={styles.des}>Kontaktperson: </FlexColumn>
          <FlexColumn className={styles.textfield}>
            <Field
              placeholder={'Kontaktperson'}
              name="responsible"
              component={SelectInput.Field}
              onSearch={query =>
                autocomplete(query, ['companies.companycontact'])}
              options={autocompleteResults.filter(
                contact => company && contact.company === Number(company.value)
              )}
              simpleValue
            />
          </FlexColumn>
        </FlexRow>

        <Button className={styles.submit} submit>
          Lagre
        </Button>
      </Form>
    </div>
  );
}

export default reduxForm({
  form: 'joblistingEditor',
  enableReinitialize: true,
  validate(values) {
    const errors = {};
    if (!values.title) {
      errors.title = 'Du må gi jobbannonsen en tittel';
    }
    if (!values.company) {
      errors.company = 'Du må angi en bedrift for jobbannonsen';
    }
    if (parseInt(values.fromYear, 10) > parseInt(values.toYear, 10)) {
      errors.toYear = "'Til år' kan ikke være lavere enn 'Fra år'";
    }
    const visibleFrom = moment.tz(values.visibleFrom, config.timezone);
    const visibleTo = moment.tz(values.visibleTo, config.timezone);
    if (visibleFrom > visibleTo) {
      errors.visibleTo = 'Sluttidspunkt kan ikke være før starttidspunkt';
    }
    return errors;
  }
})(JoblistingEditor);
