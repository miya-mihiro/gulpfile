# gulpfile

### このファイルでできること

- **pug**・・・pug を php にコンパイルする
- **img**・・・画像圧縮
- **sass**・・・sass コンパイル（min / expand）
- **csspurge**・・・css の不使用クラスを自動で削除する
- **jsmin**・・・js の圧縮（babel 対応）
- **jsintegrate**・・・js の統合（1 ファイルにまとめる）
- **sftp**・・・上記タスクの後、SFTP でサーバーにアップする
- **ftp**・・・上記タスクの後、FTP でサーバーにアップする
- **localHost**・・・ローカル環境も gulp で立ち上げる


### ファイルの作りについて

- `config.json`・・・・どのタスクを動かすかや、FTP 情報やディレクトリの設定をするファイル
- `gulpfile.js`・・・・Gulp のタスクをまとめたファイル
- `tasks/...js`・・・・それぞれのタスクを種類ごとに書いてあるファイル



### config.json の設定方法

- **taskswitch**・・・どのタスクを実行するかを切り替える（`true` / `false`）
- **sassStyle**・・・sass のコンパイル方法
- **jsStyle**・・・es6 を使う場合は`true`にする
- **root**
  - projectDir・・・gulp を動かす起点のディレクトリ
  - uploadDir・・・アップロードするディレクトリ（ftp/sftp）
  - changeDir・・・ファイルの差分を検知するためのディレクトリ
- **browser**・・・ローカル環境の起点
- **project**・・・それぞれのディレクトリ名 / ファイル名の設定
- **ftp / sftp:**・・・FTP / SFTP 情報（上記タスク後に自動でアップロードする場合）

例）sass  
```
base.projectDir + project.sasssrcDir 　//・・・コンパイル前ファイル
base.projectDir + project.sassdstDir 　//・・・コンパイル後ファイル
```

### ファイル初期値の構造

```

├- gulpfile/
├-- gulpfile.js
├-- config.json
├-- package.json
├-- package-lock.json
└-- tasks/...
├- html/
├-- sass/[コンパイル前ファイル]
├-- css/[コンパイル後ファイル](gulpで生成)
├-- images/
├-- [圧縮後ファイル](gulpで生成)
├-- ...
└-- src/
├-- [圧縮前ファイル]
└-- ...
└-- js/
├-- [圧縮後ファイル](gulpで生成)
├-- ...
├-- integrate/
├-- [統合前ファイル]
└-- ...
├-- src/
├-- [圧縮前ファイル]
├-- integrate.js(gulp で生成)
└-- ...
└-- strict/
├-- [ES6 変換後ファイル](gulpで生成)
└-- ...
└- changedfiles/[最新変更ファイル](gulpで生成・差分を検知するため)

```

---

### gulp について

- **前提：**・・・node.js をインストールする必要あり（→v12.16.1 で動作確認済み）
- **実行コマンド：**

```

cd "gulpfile のあるディレクトリ"
npm install //・・・必要なパッケージをダウンロード
npx gulp //・・・タスクランナーの実行

```

---

### 注意事項

- **compass の動作は保証できない...!!!**  
  そもそも gulp を導入している人で compass を使う人があんまりいない？？記事出てこない...最低限、とりあえず動くようにしている感じです。（どうしても compass 派の人は sassFunc.js を編集してください。。）  
  そして、「脱 Compass」的な記事が 2〜3 年前から結構出ていたので、参考までに  
  >  [compass から libsass へ。gulp の設定を見直して大幅速度 UP！](https://www.okushin.co.jp/kodanuki_note/2017/10/compass%E3%81%8B%E3%82%89libsass%E3%81%B8%E3%80%82gulp%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A6%E5%A4%A7%E5%B9%85%E9%80%9F%E5%BA%A6up%EF%BC%81.html)
