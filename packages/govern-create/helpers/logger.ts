import chalk, { ForegroundColor } from 'chalk'

const infoTag = chalk.blue('[INFO] ')
const errorTag = chalk.red('[ERROR] ')
const warnTag = chalk.yellow('[WARN] ')

export function _prependTag(
  lines: string,
  tag: string,
  color?: typeof ForegroundColor
): string {
  if (color) tag = chalk[color](tag)
  return lines
    .split('\n')
    .map((line) => tag + line)
    .join('\n')
}

export function logInfo(data: string): void {
  console.log(_prependTag(data, infoTag))
}

export function logWarn(data: string): void {
  console.log(_prependTag(data, warnTag))
}

export function logError(data: string): void {
  console.error(_prependTag(data, errorTag))
}

export function logDeploy(
  contractId: string,
  currentNetwork: string,
  contractAddress: string
): void {
  const url = `https://${
    currentNetwork === 'main' ? '' : currentNetwork + '.'
  }etherscan.io/address/${contractAddress}`

  const data = `Deployed ${contractId}
  Network: ${chalk.green(currentNetwork)}
  Address: ${chalk.green(contractAddress)}
  Url: ${chalk.underline(url)}`

  logInfo(data)
}
