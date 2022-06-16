import semver from "semver";

interface Opts {
  message?: string;
}

function errorMessage(version: string) {
    return `Node version required is ${version}, please upgrade`;
}

export default function checkNodeVersion(
  requiredVersion: string,
  { message }: Opts = {}
) {
  if (!semver.satisfies(process.version, requiredVersion)) {
    const msg = message ?? errorMessage(requiredVersion)
    console.error(msg)
    process.exit(1)
  }
}
