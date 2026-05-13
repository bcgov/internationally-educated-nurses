// Instrumentation module for web application
// Read https://nextjs.org/docs/pages/guides/instrumentation for more details
// The register function is called at applications startup

export function register() {
  process.stdout.write('Instrumentation registered\n');

  if (process.release?.name === 'node') {
    process.stdout.write(`Node.js version: ${process.version}\n`);
  } else {
    process.stdout.write(
      `Runtime other than Node.js detected: ${process.release?.name || 'unknown'}\n`,
    );
  }
}
