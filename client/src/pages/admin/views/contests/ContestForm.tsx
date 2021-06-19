import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Icon, Label, Modal, Table } from 'semantic-ui-react';
import { getRandomHexColor, isEmpty } from '../../../../core/helpers';
import { Contest, ContestProblem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import {
  CheckBoxField,
  DateTimeField,
  FormErrors,
  NumberField,
  TextField,
} from '../../../shared/extended-form';

const ContestForm: DataTableItemForm<Contest> = observer(({ item: contest, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Contest>>({
    name: isEmpty(contest.name),
    shortName: isEmpty(contest.shortName),
    activateTime: isEmpty(contest.activateTime),
    startTime: isEmpty(contest.startTime),
    endTime: isEmpty(contest.endTime),
  });
  const [problemsErrors, setProblemsErrors] = useState<FormErrors<ContestProblem>[]>(
    contest.problems.map((p) => ({ problem: isEmpty(p.problem), shortName: isEmpty(p.shortName) })),
  );
  const { data: problems, fetchAll } = rootStore.problemsStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setProblemsErrors(
      contest.problems.map((p) => ({
        problem: isEmpty(p.problem),
        shortName: isEmpty(p.shortName),
      })),
    );
  }, [contest.problems]);

  return (
    <Modal open onClose={dismiss} closeOnEscape={false}>
      <Modal.Header>{contest.id ? 'Update' : 'Create'} Contest</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <TextField<Contest>
              entity={contest}
              field="name"
              label="Name"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <TextField<Contest>
              entity={contest}
              field="shortName"
              label="Short Name"
              required
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <DateTimeField<Contest>
              entity={contest}
              field="activateTime"
              label="Activate Time"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="startTime"
              label="Start Time"
              required
              disabled={!contest.activateTime}
              minDate={contest.activateTime}
              maxDate={contest.endTime}
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="endTime"
              label="End Time"
              required
              disabled={!contest.startTime}
              minDate={contest.startTime}
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <DateTimeField<Contest>
              entity={contest}
              field="freezeTime"
              label="Freeze Time"
              clearable
              disabled={!contest.startTime}
              minDate={contest.startTime}
              maxDate={contest.endTime}
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="unfreezeTime"
              label="Unfreeze Time"
              clearable
              disabled={!contest.freezeTime}
              minDate={contest.freezeTime}
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="finalizeTime"
              label="Finalize Time"
              clearable
              disabled={!contest.endTime}
              minDate={contest.endTime}
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <CheckBoxField<Contest>
              entity={contest}
              field="enabled"
              label="Enabled"
              defaultValue={true}
              errors={errors}
              setErrors={setErrors}
            />
            <CheckBoxField<Contest>
              entity={contest}
              field="public"
              label="Visible on public scoreboard"
              defaultValue={true}
              errors={errors}
              setErrors={setErrors}
            />
            <CheckBoxField<Contest>
              entity={contest}
              field="openToAllTeams"
              label="Open to all teams"
              defaultValue={false}
              errors={errors}
              setErrors={setErrors}
            />
            <CheckBoxField<Contest>
              entity={contest}
              field="verificationRequired"
              label="Verification required"
              defaultValue={false}
              errors={errors}
              setErrors={setErrors}
            />
            <CheckBoxField<Contest>
              entity={contest}
              field="processBalloons"
              label="Process balloons"
              defaultValue={true}
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Label>Problems</Label>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Problem</Table.HeaderCell>
                <Table.HeaderCell>Short Name</Table.HeaderCell>
                <Table.HeaderCell>Points</Table.HeaderCell>
                <Table.HeaderCell>Allow Submit</Table.HeaderCell>
                <Table.HeaderCell>Allow Judge</Table.HeaderCell>
                <Table.HeaderCell>Color</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {contest.problems.map((problem, index) => (
                <Table.Row key={`${contest.id}-${index}`}>
                  <Table.Cell width="5">
                    <Form.Dropdown
                      fluid
                      selection
                      required
                      placeholder="Select Problem"
                      defaultValue={problem.problem?.id}
                      options={problems.map((p) => ({ key: p.id, text: p.name, value: p.id }))}
                      onChange={(_, { value }) => {
                        problem.problem = problems.find((p) => p.id === value)!;
                        contest.problems.forEach(
                          (cp, index) =>
                            (problemsErrors[index].problem =
                              isEmpty(problemsErrors[index].problem) ||
                              contest.problems.filter(
                                (p) => p.problem && cp.problem && p.problem.id === cp.problem.id,
                              ).length > 1),
                        );
                        setProblemsErrors(problemsErrors);
                      }}
                      error={problemsErrors[index]?.problem}
                    />
                  </Table.Cell>
                  <Table.Cell width="2">
                    <TextField<ContestProblem>
                      entity={problem}
                      field="shortName"
                      required
                      errors={problemsErrors[index]}
                      onChange={() => {
                        contest.problems.forEach(
                          (cp, index) =>
                            (problemsErrors[index].shortName =
                              isEmpty(problemsErrors[index].shortName) ||
                              contest.problems.filter(
                                (p) =>
                                  p.shortName &&
                                  cp.shortName &&
                                  p.shortName.trim() === cp.shortName.trim(),
                              ).length > 1),
                        );
                        setProblemsErrors(problemsErrors);
                      }}
                      setErrors={(errors) => {
                        problemsErrors[index] = errors;
                        setProblemsErrors(problemsErrors);
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell width="2">
                    <NumberField<ContestProblem> entity={problem} field="points" defaultValue={1} />
                  </Table.Cell>
                  <Table.Cell width="2" textAlign="center">
                    <CheckBoxField<ContestProblem>
                      entity={problem}
                      field="allowSubmit"
                      defaultValue={true}
                    />
                  </Table.Cell>
                  <Table.Cell width="2" textAlign="center">
                    <CheckBoxField<ContestProblem>
                      entity={problem}
                      field="allowJudge"
                      defaultValue={true}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      type="color"
                      value={problem.color ?? ''}
                      onChange={({ target: { value } }) => (problem.color = value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Icon
                      name="trash"
                      color="red"
                      onClick={() =>
                        (contest.problems = contest.problems.filter((_, i) => i !== index))
                      }
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.Cell
                  colSpan="7"
                  textAlign="center"
                  className="cursor-pointer"
                  style={{ background: '#F9FAFB' }}
                  onClick={() =>
                    (contest.problems = [
                      ...contest.problems,
                      { color: getRandomHexColor() } as ContestProblem,
                    ])
                  }
                >
                  <Icon name="plus" />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={() => submit(contest)}
          disabled={
            (problemsErrors &&
              problemsErrors.some((errors) => Object.values(errors).some((e) => e))) ||
            Object.values(errors).some((e) => e)
          }
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default ContestForm;
