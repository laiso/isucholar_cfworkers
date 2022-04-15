# ISUCON11本選問題のアプリケーションをCloudflare WorkersとSupabaseで実装してみる

このリポジトリは実践的なウェブアプリケーションをCloudflare Workers上で動作させ、そのアーキテクチャ特性を検証するという目的で作られました。

## アーキテクチャ
```mermaid
graph TD
  User --> Routes[Cloudflare Routes]
  Routes -- /* --> Site[Workers Site, Frontend, Nuxt App]
  Routes -- /api/* --> API[Cloudflare Workers, Backend]
  Routes -- /login --> API
  Routes -- /logout --> API
  API -- REST --> Supabase[supabase.io]
```

## やること
- [x] POST /login
- [ ] POST /logout
- [x] GET /api/users/me
- [ ] GET /api/users/me/courses
- [ ] PUT /api/users/me/courses
- [ ] GET /api/users/me/grades
- [ ] GET /api/courses
- [ ] POST /api/courses
- [ ] GET /api/courses/:courseId
- [ ] PUT /api/courses/:courseId/status
- [ ] GET /api/courses/:courseId/classes
- [ ] POST /api/courses/:courseId/classes
- [ ] POST /api/courses/:courseId/classes/:classId/assignments
- [ ] PUT /api/courses/:courseId/classes/:classId/assignments/scores
- [ ] GET /api/courses/:courseId/classes/:classId/assignments/export
- [ ] GET /api/announcements
- [ ] GET /api/announcements/:announcementId

## アプリケーションについて
https://isucon.net/archives/56163308.html

## ISUCON11について
https://isucon.net/archives/55821036.html

## フロントエンド実装
https://github.com/isucon/isucon11-final/tree/main/webapp/frontend
をそのまま利用します

## データベースについて
https://supabase.com/ のホスティング環境を利用します。
Supabaseを利用する制約上、MySQLからPostgreSQLに置き換えています

# 感謝
https://github.com/isucon/isucon11-final/tree/main/webapp/nodejs 
のNode.js版参考実装に沿って開発しています

https://github.com/remix-run/remix/ 
から多くのプラクティスを取り入れました
