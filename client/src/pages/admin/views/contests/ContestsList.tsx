import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { Contest } from '../../../../core/models';
import { hostname, rootStore } from '../../../../core/stores/RootStore';
import { MOMENT_DEFAULT_FORMAT } from '../../../shared/extended-form';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import ContestForm from './ContestForm';

const ContestsList: React.FC = observer(() => {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const {
    isUserAdmin,
    contestsStore: { data, fetchAll, create, update, remove, unzip },
    problemsStore: { fetchAll: fetchAllProblems },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllProblems()]);
  }, [fetchAll, fetchAllProblems]);

  const columns: ListPageTableColumn<Contest>[] = [
    {
      header: 'Short Name',
      field: 'shortName',
      render: (contest) => contest.shortName,
    },
    {
      header: 'Name',
      field: 'name',
      render: (contest) => contest.name,
    },
    {
      header: 'Active Time',
      field: 'activateTime',
      render: (contest) => moment(contest.activateTime).format(MOMENT_DEFAULT_FORMAT),
    },
    {
      header: 'Start Time',
      field: 'startTime',
      render: (contest) => moment(contest.startTime).format(MOMENT_DEFAULT_FORMAT),
    },
    {
      header: 'End Time',
      field: 'endTime',
      render: (contest) => moment(contest.endTime).format(MOMENT_DEFAULT_FORMAT),
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (contest) => (contest.enabled ? 'Yes' : 'No'),
    },
    {
      header: 'Public?',
      field: 'public',
      render: (contest) => (contest.public ? 'Yes' : 'No'),
    },
    {
      header: 'Teams',
      field: 'teams',
      render: (contest) => contest.teams.length,
    },
    {
      header: 'Problems',
      field: 'problems',
      render: (contest) => contest.problems.length,
    },
  ];

  return (
    <ListPage<Contest>
      header="Contests"
      data={data}
      columns={columns}
      formItemInitValue={observable({ problems: [] })}
      ItemForm={isUserAdmin ? ContestForm : undefined}
      onDelete={remove}
      extraActions={
        <Button className="mr-2" color="blue" icon onClick={() => uploadInputRef.current?.click()}>
          <Icon name="upload" />
          <input
            type="file"
            multiple
            hidden
            ref={(ref) => (uploadInputRef.current = ref)}
            onChange={async (event) => {
              const files = event.target.files;
              if (files?.length) {
                await unzip(files[0]);
              }
            }}
          />
        </Button>
      }
      zipUrl={({ id }) => `${hostname}/api/contests/${id}/zip`}
      withoutActions={!isUserAdmin}
      onRefresh={() => Promise.all([fetchAll(), fetchAllProblems()])}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ContestsList;
