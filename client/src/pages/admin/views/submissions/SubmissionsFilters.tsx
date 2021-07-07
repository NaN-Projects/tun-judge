import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { rootStore } from '../../../../core/stores/RootStore';
import { Filters } from '../../../../core/stores/SubmissionsStore';
import { DropdownField } from '../../../shared/extended-form';

const SubmissionsFilters: React.FC<{
  filters: Partial<Filters>;
}> = observer(({ filters }) => {
  const {
    languagesStore: { fetchAll: fetchAllLanguages, data: languages },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAllLanguages();
  }, [fetchAllLanguages]);

  return (
    <div className="grid sm:grid-cols-4 gap-4 p-4 bg-white rounded border shadow">
      <DropdownField<Filters>
        entity={filters}
        field="problems"
        label="Filter by problem"
        placeHolder="All Problems"
        multiple
        options={
          currentContest?.problems.map(({ shortName, problem }) => ({
            key: problem.id,
            text: `${shortName} - ${problem.name}`,
          })) ?? []
        }
        optionsIdField="key"
        optionsTextField="text"
        optionsValueField="key"
      />
      <DropdownField<Filters>
        entity={filters}
        field="teams"
        label="Filter by team"
        placeHolder="All Teams"
        multiple
        options={currentContest?.teams ?? []}
        optionsIdField="id"
        optionsTextField="name"
        optionsValueField="id"
      />
      <DropdownField<Filters>
        entity={filters}
        field="languages"
        label="Filter by language"
        placeHolder="All Languages"
        multiple
        options={languages}
        optionsIdField="id"
        optionsTextField="name"
        optionsValueField="id"
      />
      <DropdownField<Filters>
        entity={filters}
        field="status"
        label="Filter by status"
        placeHolder="All"
        options={[
          {
            key: 'all',
            text: 'All',
            value: undefined,
          },
          {
            key: 'notJudged',
            text: 'Not Judged',
            value: 'notJudged',
          },
          {
            key: 'notVerified',
            text: 'Not Verified',
            value: 'notVerified',
          },
        ]}
        optionsIdField="key"
        optionsTextField="text"
        optionsValueField="value"
      />
    </div>
  );
});

export default SubmissionsFilters;