:: Sign keybase.exe and generate a signed installer, with an embedded signed uninsaller
:: $1 is full path to keybase.exe
:: todo: specify output?
::
:: get the target build folder. Assume winresource.exe has been built.
:: If not, go there and do "go generate"
set Folder=%GOPATH%\src\github.com\keybase\client\go\keybase\
set PathName=%Folder%keybase.exe

:: Capture the windows style version - this is the only way to store it in a .cmd variable
for /f %%i in ('%Folder%winresource.exe -w') do set BUILDVER=%%i
echo %BUILDVER%

:: Capture keybase's semantic version - this is the only way to store it in a .cmd variable
for /f "tokens=3" %%i in ('%PathName% -version') do set SEMVER=%%i
echo %SEMVER%

:: Other alternate time servers:
::   http://timestamp.verisign.com/scripts/timstamp.dll
::   http://timestamp.globalsign.com/scripts/timestamp.dll
::   http://tsa.starfieldtech.com
::   http://timestamp.comodoca.com/authenticode
::   http://timestamp.digicert.com
::SignTool.exe sign /a /tr http://timestamp.digicert.com %1
::IF %ERRORLEVEL% NEQ 0 (
::  EXIT /B 1
::)

"%ProgramFiles(x86)%\Inno Setup 5\iscc.exe" /DMyExePathName=%PathName% /DMyAppVersion=%BUILDVER% /DMySemVersion=%SEMVER% "/sSignCommand=signtool.exe sign /tr http://timestamp.digicert.com $f" %GOPATH%\src\github.com\keybase\client\packaging\windows\setup_windows.iss
