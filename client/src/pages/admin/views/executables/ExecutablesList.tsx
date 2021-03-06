import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Executable, ExecutableType } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import { CodeEditorDialog } from '../../../shared/dialogs';
import ExecutableForm from './ExecutableForm';

const executableTypeText: Record<ExecutableType, string> = { RUNNER: 'Runner', CHECKER: 'Checker' };

const ExecutablesList: React.FC = observer(() => {
  const [scriptData, setScriptData] = useState<
    { executable: Executable; field: 'file' | 'buildScript' } | undefined
  >();
  const {
    isUserAdmin,
    executablesStore: { fetchAll, create, update, remove },
  } = rootStore;

  const columns: ListPageTableColumn<Executable>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (executable) => executable.name,
    },
    {
      header: 'Type',
      field: 'type',
      render: (executable) => executableTypeText[executable.type],
    },
    {
      header: 'Source File',
      field: 'file',
      render: (executable) => (
        <div
          className="text-blue-700 cursor-pointer"
          onClick={() =>
            setScriptData({
              executable,
              field: 'file',
            })
          }
        >
          {executable.file.name}
        </div>
      ),
    },
    {
      header: 'Build Script',
      field: 'buildScript',
      render: (executable) =>
        executable.buildScript ? (
          <div
            className="text-blue-700 cursor-pointer"
            onClick={() =>
              setScriptData({
                executable,
                field: 'buildScript',
              })
            }
          >
            {executable.buildScript.name}
          </div>
        ) : (
          '-'
        ),
    },
    {
      header: 'Docker Image',
      field: 'dockerImage',
      render: (executable) => executable.dockerImage ?? '-',
    },
    {
      header: 'Default',
      field: 'default',
      render: (executable) => (executable.default ? 'Yes' : 'No'),
    },
  ];

  return (
    <>
      <DataTable<Executable>
        header="Executables"
        dataFetcher={fetchAll}
        columns={columns}
        ItemForm={isUserAdmin ? ExecutableForm : undefined}
        onDelete={remove}
        withoutActions={!isUserAdmin}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
      <CodeEditorDialog
        file={scriptData?.executable[scriptData.field]}
        readOnly={!isUserAdmin}
        lang={scriptData?.executable[scriptData.field].name.endsWith('.cpp') ? 'c_cpp' : 'sh'}
        dismiss={async () => {
          await fetchAll();
          setScriptData(undefined);
        }}
        submit={async () => {
          await update(scriptData!.executable);
          setScriptData(undefined);
        }}
      />
    </>
  );
});

export default ExecutablesList;
