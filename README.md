# ChordPro Preview

chordpro形式のファイルのプレビューを表示するVsCodeの拡張機能です。

## 使い方

1. .chordproファイルを作成。
1. `⌘⇧P`でコマンドウィンドウを表示
1. `Show ChordPro Preview`コマンドを入力
1. プレビューが表示されます

####  コマンド
```
Show ChordPro Preview
```

## 対応している記述法
現状は以下のように最低限のみ対応しています。
下記のようなchordpro形式に対応。
```plaintext
{title: ごあいさつ}
{artist: HelloMan}
{key: A}
{capo: 2}
[A]おはよう [D]こんにちは [E]ありが[A]とう
```

コード名|コード記述
-|-
タイトル|{title: ごあいさつ}
アーティスト名|{artist: HelloMan}
キー| {key: A}
カポ| {capo: 2}




