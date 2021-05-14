import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Icon, Menu, Segment, Table } from 'semantic-ui-react';
import { dateComparator, formatRestTime } from '../../../../core/helpers';
import { Judging, Submission, Testcase } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { Filters } from '../../../../core/stores/SubmissionsStore';
import { resultMap } from '../../../../core/types';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';

const SubmissionsList: React.FC = observer(() => {
  const history = useHistory();
  const {
    profile,
    updatesCount: { judgings, judgeRuns },
    submissionsStore: { data, total, page, setPage, filters, setFilters, fetchAll, claim, unClaim },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [page, filters, judgings, judgeRuns, fetchAll]);

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      render: (submission) => (
        <a className="cursor-pointer" onClick={() => history.push(`/submissions/${submission.id}`)}>
          {formatRestTime(
            (new Date(submission.submitTime).getTime() -
              new Date(currentContest?.startTime ?? 0).getTime()) /
              1000,
          )}
        </a>
      ),
    },
    {
      header: 'Team',
      field: 'team',
      disabled: (submission) => !submission.valid,
      render: (submission) => submission.team.name,
    },
    {
      header: 'Problem',
      field: 'problem',
      disabled: (submission) => !submission.valid,
      render: ({ problem }) => (
        <a href={`/problems/${problem.id}`} target="_blank" rel="noreferrer">
          {problem.name}
        </a>
      ),
    },
    {
      header: 'Language',
      field: 'language',
      disabled: (submission) => !submission.valid,
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
          .shift();
        return (
          <b
            style={{
              color: judging?.result ? (judging.result === 'AC' ? 'green' : 'red') : 'grey',
            }}
          >
            {judging?.result ? resultMap[judging.result] : 'Pending'}
          </b>
        );
      },
    },
    {
      header: 'Verified by',
      field: 'judgings',
      disabled: (submission) => !submission.valid,
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
          .shift();
        return judging?.result ? (
          judging.verified ? (
            `Yes by ${judging.juryMember.username}`
          ) : judging.juryMember ? (
            judging.juryMember.username === profile?.username ? (
              <Button
                onClick={async () => {
                  await unClaim(submission.id);
                  await fetchAll();
                }}
              >
                UnClaim
              </Button>
            ) : (
              `Claimed by ${judging.juryMember?.username}`
            )
          ) : (
            <Button
              onClick={async () => {
                await claim(submission.id);
                history.push(`/submissions/${submission.id}`);
              }}
            >
              Claim
            </Button>
          )
        ) : (
          '-'
        );
      },
    },
    {
      header: 'Test Results',
      field: 'judgings',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true));
        return submission.problem.testcases
          .slice()
          .sort((a, b) => a.rank - b.rank)
          .map((testcase) => (
            <Icon
              key={`${submission.id}-${testcase.id}`}
              name="check square"
              color={isTestcaseSolved(testcase, judging.length ? judging[0] : undefined)}
            />
          ));
      },
    },
  ];

  return (
    <ListPage<Submission>
      header="Submissions"
      data={data}
      columns={columns}
      filters={<SubmissionsFilters filters={filters} onChange={setFilters} />}
      pagination={
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="8">
              <Menu floated="right" pagination>
                <Menu.Item as="a" icon onClick={() => page && setPage(page - 1)}>
                  <Icon name="chevron left" />
                </Menu.Item>
                {new Array(Math.ceil(total / 10)).fill(0).map((_, index) => (
                  <Menu.Item
                    key={`page-${index}`}
                    as="a"
                    onClick={() => setPage(index)}
                    active={page === index}
                  >
                    {index + 1}
                  </Menu.Item>
                ))}
                <Menu.Item
                  as="a"
                  icon
                  onClick={() => page + 1 < Math.ceil(total / 10) && setPage(page + 1)}
                >
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      }
      onRefresh={fetchAll}
      withoutActions
    />
  );
});

export default SubmissionsList;

const SubmissionsFilters: React.FC<{
  filters: Partial<Filters>;
  onChange?: (filters: Partial<Filters>) => void;
}> = observer(({ filters, onChange }) => {
  const {
    languagesStore: { fetchAll: fetchAllLanguages, data: languages },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAllLanguages();
  }, [fetchAllLanguages]);

  return (
    <Segment>
      <Form>
        <Form.Group widths="equal">
          <Form.Dropdown
            label="Filter by problem"
            fluid
            multiple
            selection
            clearable
            value={filters.problems ?? []}
            placeholder="All Problems"
            options={
              currentContest?.problems.map(({ shortName, problem }) => ({
                key: problem.id,
                text: `${shortName} - ${problem.name}`,
                value: problem.id,
              })) ?? []
            }
            onChange={(_, { value }) => {
              const problems = value as number[];
              if (problems.length) {
                onChange?.({ ...filters, problems });
              } else {
                delete filters.problems;
                onChange?.(filters);
              }
            }}
          />
          <Form.Dropdown
            label="Filter by team"
            fluid
            multiple
            selection
            clearable
            value={filters.teams ?? []}
            placeholder="All Teams"
            options={
              currentContest?.teams.map((team) => ({
                key: team.id,
                text: team.name,
                value: team.id,
              })) ?? []
            }
            onChange={(_, { value }) => {
              const teams = value as number[];
              if (teams.length) {
                onChange?.({ ...filters, teams });
              } else {
                delete filters.teams;
                onChange?.(filters);
              }
            }}
          />
          <Form.Dropdown
            label="Filter by language"
            fluid
            multiple
            selection
            clearable
            value={filters.languages ?? []}
            placeholder="All Languages"
            options={languages.map((language) => ({
              key: language.id,
              text: language.name,
              value: language.id,
            }))}
            onChange={(_, { value }) => {
              const languages = value as number[];
              if (languages.length) {
                onChange?.({ ...filters, languages });
              } else {
                delete filters.languages;
                onChange?.(filters);
              }
            }}
          />
          <Form.Dropdown
            label="Filter by status"
            fluid
            selection
            clearable
            value={filters.notJudged ? 'notJudged' : filters.notVerified ? 'notVerified' : ''}
            placeholder="All"
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
            onChange={(_, { value }) => {
              if (value === 'notJudged') {
                filters.notJudged = true;
                delete filters.notVerified;
              } else if (value === 'notVerified') {
                filters.notVerified = true;
                delete filters.notJudged;
              } else {
                delete filters.notJudged;
                delete filters.notVerified;
              }
              onChange?.(filters);
            }}
          />
        </Form.Group>
      </Form>
    </Segment>
  );
});

function isTestcaseSolved(testcase: Testcase, judging?: Judging): 'grey' | 'green' | 'red' {
  if (!judging) return 'grey';
  const judgeRun = judging.runs.find((r) => r.testcase.id === testcase.id);
  return !judgeRun ? 'grey' : judgeRun.result === 'AC' ? 'green' : 'red';
}
