import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('chordproPreview.showPreview', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('ChordProファイルを開いてください。');
      return;
    }

    const text = editor.document.getText();
    const html = convertChordProToHTML(text);

    const panel = vscode.window.createWebviewPanel(
      'chordproPreview',
      'ChordPro Preview',
      vscode.ViewColumn.Beside,
      {}
    );

    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

function convertChordProToHTML(text: string): string {
  const lines = text.split('\n');
  // タイトルとアーティストを抽出
  let title = 'Untitled';
  let artist = '';
  let key = '';
  let capo = '';
  const filteredLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('{title:')) {
      title = line.match(/\{title:\s*(.*?)\}/)?.[1] ?? title;
    } else if (line.startsWith('{artist:')) {
      artist = line.match(/\{artist:\s*(.*?)\}/)?.[1] ?? artist;
    } else if (line.startsWith('{key:')) {
      key = line.match(/\{key:\s*(.*?)\}/)?.[1] ?? '';
    } else if (line.startsWith('{capo:')) {
      capo = line.match(/\{capo:\s*(.*?)\}/)?.[1] ?? '';
    } else {
      filteredLines.push(line);
    }
  }


  const body = filteredLines.map(line => {

    if (line.trim() === '') {
      // 空行の場合は段落間の余白を追加
      return `<div class="spacer"></div>`;
    }

    
    const chordRegex = /\[([A-G][#b]?[^\/\[\]]*(?:\/[A-G][#b]?)?)\]/g;
  
    // コードが1つでも含まれていれば chordWrap 方式
    if (chordRegex.test(line)) {
      const parts: string[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
  
      chordRegex.lastIndex = 0; // 念のためリセット
  
      while ((match = chordRegex.exec(line)) !== null) {
        const chord = match[1];
        const chordIndex = match.index;
  
        // コード前の歌詞部分
        if (chordIndex > lastIndex) {
          const lyricPrefix = line.slice(lastIndex, chordIndex);
          parts.push(`<span class="chordWrap"><span class="chord">&nbsp;</span><span class="lyric">${lyricPrefix}</span></span>`);
        }
  
        const lyricChar = line[chordRegex.lastIndex] ?? '';
        parts.push(`<span class="chordWrap"><span class="chord">${chord}</span><span class="lyric">${lyricChar}</span></span>`);
  
        lastIndex = chordRegex.lastIndex + 1;
      }
  
      // 行末に残った文字があれば追加
      if (lastIndex < line.length) {
        const remaining = line.slice(lastIndex);
        parts.push(`<span class="chordWrap"><span class="chord">&nbsp;</span><span class="lyric">${remaining}</span></span>`);
      }
  
      return `<p>${parts.join('')}</p>`;
    } else {
      // コードがまったくない行 → 歌詞のみ表示
      return `<p class="lyricOnly">${line}</p>`;
    }
  }).join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body { 
    font-family: sans-serif; 
    padding: 2em; 
    line-height: 1.3; 
    }
    h1, h2, h3 {
      margin-top: 0;
      margin-bottom: 0.5em;
    }
    p { 
    margin: 0.5em 0; display: flex; flex-wrap: wrap; align-items: flex-end;
    font-size: min(1.4em, 24px); 
    }
    .chordWrap { 
      display: inline-flex; 
      flex-direction: column; 
      margin-right: 0.5em; 
      min-width: 1em; 
    }
    .chord { 
      color: var(--vscode-editorError-foreground); 
      font-weight: 500; 
      height: 1.3em; 
    }
    .spacer {
      height: 1.5em; /* 段落間の余白 */
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <h2>${artist}</h2>
  <div class="meta">
    ${key ? `<div><strong>Key:</strong> ${key}</div>` : ''}
    ${capo ? `<div><strong>Capo:</strong> ${capo}</div>` : ''}
  </div>
  ${body}
</body>
</html>`;
}
