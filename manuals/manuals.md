# Next.jsのセットアップ

```bash
npx create-next-app@latest frontend
cd frontend
```

# Honoの設定

```bash
npm i hono pg
npm install @types/pg
```

# Shadcn/uiのインストール

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add textarea
```

# Prismaのセットアップ

```bash
# Prismaのインストール
npm install prisma --save-dev
npm install @prisma/client

# Prismaの初期化
npx prisma init

# Prismaを使用しマイグレーション
npx prisma migrate dev --name init

# Prismaクライアントの生成
npx prisma generate

# 他メモ
npx prisma migrate dev --name add-messages-table
```

# Supabaseのログイン

## Supabaseのデータベースの型定義

まずはSupabaseの型定義をSupabaseにログインし取得する。
TypeScriptで使用する場合は、DBの型定義が必要となる。

```bash
npx supabase login
# supabase CLIを使ってSupabaseのDatabaseの型を作成する
npx supabase gen types typescript --project-id [SupabaseのreferenceID] > src/app/type/database.types.ts
```

# Supabaseのインストール

```bash
npm i @supabase/auth-helpers-nextjs
```

# その他のインストール

```bash

```
