$ErrorActionPreference = "Stop"
Write-Host "Register API:"
curl.exe -X POST "http://localhost:3000/api/auth/register" -H "Content-Type: application/json" -d "{\`"name\`":\`"Test2\`",\`"email\`":\`"test2@test.com\`",\`"password\`":\`"123456\`",\`"role\`":\`"student\`"}"

Write-Host "`nLogin API:"
curl.exe -X POST "http://localhost:3000/api/auth/login" -H "Content-Type: application/json" -d "{\`"email\`":\`"test2@test.com\`",\`"password\`":\`"123456\`"}"
