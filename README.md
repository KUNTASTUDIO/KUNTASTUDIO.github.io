# KUNTA STUDIO

공식 사이트: https://kuntastudio.github.io/

## GitHub Pages 설정 (중요)

**Settings → Pages → Build and deployment → Source** 는 반드시 **GitHub Actions** 여야 합니다.

| 설정 | 결과 |
|---|---|
| **GitHub Actions** | 정상 (MkDocs 빌드, CSS·메뉴·레이아웃 적용) |
| Deploy from a branch (`main` / `docs`) | **깨짐** (원본 md만 보임, 디자인 없음) |

`Deploy from a branch` 로 바꾸면 사이트가 다시 이상하게 보입니다. **건드리지 마세요.**

## 직접 수정할 때

1. `docs/` 폴더의 파일 수정
2. `git add` → `git commit` → `git push origin main`
3. Actions 탭에서 **Deploy site** 워크플로 성공 확인 (1~2분)
