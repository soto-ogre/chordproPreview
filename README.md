# ChordPro Preview

ChordPro形式のファイルをプレビュー表示するVS Codeの拡張機能です。
chordproject-parserを使用しています。

## 使い方

1. `.chordpro`ファイルを作成します。
2. `⌘⇧P`（Mac）または `Ctrl+Shift+P`（Windows/Linux）でコマンドパレットを開きます。
3. `Show ChordPro Preview`コマンドを入力します。
4. プレビューが表示されます。

### コマンド

以下のコマンドを使用できます。

```bash
Show ChordPro Preview
```

## 対応している記述法

現状は以下のようなChordPro形式に対応しています。

### サンプル

```plaintext
{title: ごあいさつ}
{artist: HelloMan}
{key: A}
{capo: 2}
[A]おはよう [D]こんにちは [E]ありが[A]とう
```

## 更新履歴

- **2025/04/30**: コードのフォーマットにchordproject-parserを使用。
- **2025/04/24**: ドキュメントの変更に応じてプレビューが自動的に更新されるようになりました。
- **2025/04/23**: リポジトリ公開
