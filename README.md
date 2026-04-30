# Novu - Prueba Tecnica Digital Developer

Este repo es la solucion de la prueba tecnica para la campana ficticia **"Start Fresh"** de Novu.
La idea fue construir:

- 3 banners HTML5 animados.
- 1 email HTML responsive.
- Un preview local para revisar todo rapido.

#### Github Pages: https://dpuello.github.io/Novu-test/

## Que incluye exactamente

- Banners:
- `300x250`
- `728x90`
- `160x600`

- Email:
- Fuente editable en MJML.
- HTML final compilado para enviar por plataforma de correo.

- Preview:
- Una pagina raiz para revisar banners y email sin montar nada raro.

## Stack usado

- HTML5, CSS3 y JavaScript.
- GSAP para animaciones de banners.
- MJML para construir el email.
- Git para versionado.
- Vite para desarrollo y build.

## Estructura del proyecto

- `banners/300x250/`, `banners/728x90/`, `banners/160x600/`: codigo fuente de banners.
- `email/index.mjml`: archivo editable del email.
- `email/index.html`: HTML final del email (compilado).
- `index.html` y `main.js`: preview central.
- `scripts/package-banners.cjs`: empaquetado de banners para entrega.
- `packages/`: banners listos para zip/publicacion.
- `dist/`: build final de produccion.

## Como correrlo en 5 minutos

1. Instala dependencias:
```bash
npm install
```
2. Levanta preview local:
```bash
npm run dev
```
3. Abre la URL que te da la consola (normalmente `http://localhost:5173`).
4. Ahi vas a ver:
- Los 3 banners.
- El preview del email.

## Comandos utiles

- `npm run dev`: entorno local para revisar rapido.
- `npm run build`: build completo (banners + preview + email en `dist/`).
- `npm run build:email`: recompila solo el email desde `email/index.mjml`.
- `npm run package:banners`: genera carpetas standalone por banner en `packages/`.
- `npm run preview`: sirve `dist/` para revisar salida final.

