// organize-imports-ignore
import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-kotlin';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-scala';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

export type CodeEditorLanguages =
  | 'sh'
  | 'text'
  | 'c_cpp'
  | 'csharp'
  | 'java'
  | 'kotlin'
  | 'scala'
  | 'javascript'
  | 'typescript'
  | 'python';

type CodeEditorProps = {
  lang?: CodeEditorLanguages;
  value: string;
  dark?: boolean;
  readOnly?: boolean;
  showGutter?: boolean;
  onChange?: (value: string) => void;
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  lang,
  value,
  dark,
  readOnly,
  showGutter,
  onChange,
}) => {
  return (
    <AceEditor
      style={{
        border: '0.5px grey solid',
        borderRadius: '.28571429rem',
      }}
      mode={lang ?? 'text'}
      theme={dark ? 'tomorrow_night' : 'chrome'}
      value={value}
      width="100%"
      onChange={onChange}
      readOnly={readOnly}
      showGutter={showGutter}
    />
  );
};

export default CodeEditor;
