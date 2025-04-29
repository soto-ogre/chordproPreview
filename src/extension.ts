import * as vscode from 'vscode';
import { ChordProParser, HtmlFormatter } from "chordproject-parser";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('chordproPreview.showPreview', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('ChordProファイルを開いてください。');
      return;
    }

    const updatePreview = () => {
      if (!editor || !panel) {
        return;
      }
      try {
        const text = editor.document.getText();
        const html = convertChordProToHTML(text);
        panel.webview.html = html;
      } catch (error) {
        console.error('Error updating preview:', error);
        vscode.window.showErrorMessage('プレビューの更新中にエラーが発生しました。');
      }
    };

    const panel = vscode.window.createWebviewPanel(
      'chordproPreview',
      'ChordPro Preview',
      vscode.ViewColumn.Beside,
      {}
    );

    updatePreview();

    const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
      if (event.document === editor.document) {
        updatePreview();
      }
    });

    context.subscriptions.push(documentChangeDisposable);

    // panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

function convertChordProToHTML(text: string): string {
  const parser = new ChordProParser();
  const song = parser.parse(text);
  const formatter = new HtmlFormatter();
  const result = formatter.format(song);


  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
  body {
    padding-block: 2rem 6rem;
  }
  .lyrics-line {
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      font-size: 1.3em;
  }

  .chord-lyrics {
      display: flex;
      flex-direction: column;
      align-items: left;
  }

  .above-lyrics {
      padding-right: 0.3em;
  }

  .chord {
      font-weight: 500;
      color: var(--vscode-editorError-foreground);
      color: #5D978D; 
  }

  .chord-lyrics:last-child .chord {
      padding-right: 0;
  }

  .word {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      margin-right: 0.33em;
  }

  .empty-line {
      margin-top: 1.5em;
  }

.chorus-section {
    font-weight: bold;
    border-left: 2px black solid;
    padding-left: 1em;
}

.tab-section {
    font-family: monospace;
}
  </style>
</head>
<body>
  ${result.join(" ")}
</body>
</html>`;
}
