$rules = @'
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
'@

Set-Clipboard -Value $rules
Write-Host ""
Write-Host "Regras copiadas para a area de transferencia." -ForegroundColor Green
Write-Host "Abrindo o Firebase Console..." -ForegroundColor Yellow
Write-Host "Cole com Ctrl+V na aba Regras e clique em Publicar." -ForegroundColor Yellow
Write-Host ""

Start-Process "https://console.firebase.google.com/project/monte-cristo-solidario/database/monte-cristo-solidario-default-rtdb/rules"
