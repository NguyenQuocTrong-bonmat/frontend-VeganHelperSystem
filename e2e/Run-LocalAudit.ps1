param([string] $BackendRoot = (Join-Path (Join-Path $PSScriptRoot '../..') 'VeganHelperProject'))

$ErrorActionPreference = 'Stop'
$container = 'veganhelper-audit-e2e-' + [Guid]::NewGuid().ToString('N').Substring(0, 8)
$logs = Join-Path ([IO.Path]::GetTempPath()) $container
New-Item -ItemType Directory -Path $logs | Out-Null
$backendProcess = $null
Push-Location (Join-Path $PSScriptRoot '..')
try {
    docker run -d --rm --name $container -p 127.0.0.1::5432 -e POSTGRES_PASSWORD=e2e_test_only -e POSTGRES_DB=veganhelper_audit_e2e -e 'POSTGRES_INITDB_ARGS=--locale-provider=icu --icu-locale=en-US' postgres:17
    if ($LASTEXITCODE -ne 0) { throw 'Could not start isolated PostgreSQL.' }
    $port = (docker port $container 5432/tcp) -replace '^127\.0\.0\.1:', ''
    for ($i = 0; $i -lt 30; $i++) {
        docker exec $container pg_isready -h 127.0.0.1 -U postgres 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { break }
        Start-Sleep -Seconds 1
    }

    $api = 'http://127.0.0.1:7188'
    $frontend = 'http://127.0.0.1:3030'
    $env:ConnectionStrings__DefaultConnection = "Host=127.0.0.1;Port=$port;Database=veganhelper_audit_e2e;Username=postgres;Password=e2e_test_only"
    $env:VEGANHELPER_SKIP_LOCAL_CONFIG = '1'
    $env:ASPNETCORE_ENVIRONMENT = 'Development'
    $env:DOTNET_ENVIRONMENT = 'Development'
    $env:ASPNETCORE_URLS = $api
    $env:Frontend__BaseUrl = $frontend
    $env:Cors__AllowedOrigins__0 = $frontend
    $env:Jwt__SigningKey = 'isolated-audit-e2e-signing-key-no-production-use'
    $env:Registration__Enabled = 'true'
    $env:SendGrid__ApiKey = ' '
    $env:SendGrid__FromEmail = ' '
    $env:ModerationAi__Enabled = 'false'
    $env:GroqSummary__Enabled = 'false'
    $env:MealPlanning__WorkerEnabled = 'false'
    $env:WebPush__Enabled = 'false'
    $env:PayOS__Enabled = 'false'

    $resolvedBackend = (Resolve-Path $BackendRoot).Path
    $apiProject = Join-Path $resolvedBackend 'src/VeganHelper.API/VeganHelper.API.csproj'
    dotnet build $apiProject -c Release --nologo
    if ($LASTEXITCODE -ne 0) { throw 'Backend build failed.' }
    $apiDll = Join-Path $resolvedBackend 'src/VeganHelper.API/bin/Release/net10.0/VeganHelper.API.dll'
    Push-Location (Split-Path $apiProject)
    try {
        dotnet $apiDll --migrate
        if ($LASTEXITCODE -ne 0) { throw 'Isolated database migration failed.' }
        $env:VH_E2E_BE_LOG = Join-Path $logs 'backend.log'
        $backendProcess = Start-Process dotnet -PassThru -WindowStyle Hidden -ArgumentList ('"' + $apiDll + '"') -RedirectStandardOutput $env:VH_E2E_BE_LOG -RedirectStandardError (Join-Path $logs 'backend.err.log')
    } finally { Pop-Location }

    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        try { $ready = (Invoke-WebRequest "$api/health/live" -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200 } catch { }
        if ($ready -or $backendProcess.HasExited) { break }
        Start-Sleep -Seconds 1
    }
    if (-not $ready) { throw "Backend did not start. Check $logs." }
    $env:VH_E2E_DB_CONTAINER = $container
    $env:VH_E2E_FE_URL = $frontend
    $env:VH_E2E_API_URL = $api
    npm run test:e2e
    exit $LASTEXITCODE
} finally {
    if ($null -ne $backendProcess -and -not $backendProcess.HasExited) { Stop-Process -Id $backendProcess.Id }
    docker stop $container | Out-Null
    Pop-Location
}
