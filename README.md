# TMLFE — Alpha para GitHub Pages

Prototipo funcional de **Trade Machine Liga Franquicia Extraditables**.

## Publicarlo en GitHub Pages

1. Crea en GitHub un repositorio público llamado `TMLFE`.
2. Entra en el repositorio y pulsa **Add file → Upload files**.
3. Descomprime `TMLFE-GitHub-Ready.zip` en tu ordenador.
4. Sube **todos los archivos y carpetas de su interior**, incluyendo `.github`.
5. Escribe un mensaje como `Primera versión TMLFE` y pulsa **Commit changes**.
6. Abre **Settings → Pages**.
7. En **Build and deployment → Source**, elige **GitHub Actions**.
8. Abre la pestaña **Actions** y espera a que termine el flujo `Deploy TMLFE to GitHub Pages`.
9. La dirección será normalmente:
   `https://TU-USUARIO.github.io/TMLFE/`

## Funciones de esta Alpha

- Dashboard premium en modo oscuro.
- Plantilla editable y persistencia mediante `localStorage`.
- Trade Machine con validación salarial en directo.
- Límite salarial de 170 M y presupuesto de 228 M.
- Rechazo cuando el equipo queda exactamente en 170 M.
- Salary Center e historial de operaciones.
- Buscador rápido con `Ctrl + K`.
- Homenajes discretos a Kobe, Dirk, Iverson y Jaycee Carroll.

## Limitación actual

GitHub Pages solo aloja archivos estáticos. Los cambios se guardan únicamente en el navegador y dispositivo que los realiza. Para cuentas de usuario y datos compartidos entre todos los GMs será necesario conectar posteriormente un servicio de base de datos y autenticación.
