# KUNTA STUDIO

공식 사이트: https://kuntastudio.github.io/

## GitHub Pages 설정 (필수 — 여기만 맞추면 됨)

**Settings → Pages → Build and deployment**

1. **Source**: `Deploy from a branch` 선택
2. **Branch**: `gh-pages` ← 이것만 사용
3. **Folder**: `/ (root)`

| Branch | 결과 |
|---|---|
| **`gh-pages` / root** | 정상 (빌드된 사이트) |
| `main` / root | 깨짐 (README만 보임) |
| `main` / docs | 깨짐 (CSS 없음) |

**`main` 브랜치는 절대 Pages 소스로 쓰지 마세요.**

push 할 때마다 Actions가 `gh-pages` 브랜치를 자동으로 최신 빌드로 갱신합니다.

## 직접 수정할 때

1. `docs/` 폴더 수정
2. `git add` → `git commit` → `git push origin main`
3. Actions **Deploy site** 성공 확인 (1~2분)
