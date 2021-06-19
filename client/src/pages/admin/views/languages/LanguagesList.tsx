import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Language } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import { CodeEditorDialog } from '../../../shared/dialogs';
import LanguageForm from './LanguageForm';

const LanguagesList: React.FC = observer(() => {
  const [scriptData, setScriptData] = useState<Language | undefined>();
  const {
    isUserAdmin,
    languagesStore: { data: languages, fetchAll, create, update, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const columns: ListPageTableColumn<Language>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (language) => language.name,
    },
    {
      header: 'Docker Image',
      field: 'dockerImage',
      render: (language) => language.dockerImage,
    },
    {
      header: 'Build Script',
      field: 'buildScript',
      render: (language) => (
        <a onClick={() => setScriptData(language)}>{language.buildScript.name}</a>
      ),
    },
    {
      header: 'Allow Submit?',
      field: 'allowSubmit',
      render: (language) => (language.allowSubmit ? 'Yes' : 'No'),
    },
    {
      header: 'Allow Judge?',
      field: 'allowJudge',
      render: (language) => (language.allowJudge ? 'Yes' : 'No'),
    },
    {
      header: 'Extensions',
      field: 'extensions',
      render: (language) => language.extensions.join(', '),
    },
  ];

  return (
    <>
      <DataTable<Language>
        header="Languages"
        data={languages}
        columns={columns}
        ItemForm={isUserAdmin ? LanguageForm : undefined}
        onDelete={remove}
        onRefresh={fetchAll}
        withoutActions={!isUserAdmin}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
      {scriptData && (
        <CodeEditorDialog
          file={scriptData.buildScript}
          dismiss={async () => {
            await fetchAll();
            setScriptData(undefined);
          }}
          submit={
            isUserAdmin
              ? async () => {
                  await update(scriptData);
                  setScriptData(undefined);
                }
              : undefined
          }
        />
      )}
    </>
  );
});

export default LanguagesList;
