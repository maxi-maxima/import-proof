# Security

`import-proof` reads local source files and local dependency metadata. It writes local reports and does not send code or dependency data to a remote service.

## Reporting Issues

Please report security issues privately if you find:

- arbitrary file writes outside the output directory
- command execution through crafted source or package files
- unsafe handling of package paths
