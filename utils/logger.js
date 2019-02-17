

let consoleOutput = true

function log() {
    console.log.apply(console, arguments)
}

function error() {
    console.log.apply(console, arguments)
}

function debug() {
    console.log.apply(console, arguments)
}

function warn() {
    console.log.apply(console, arguments)
}

function info() {
    console.log.apply(console, arguments)
}

var consoleExportObj = {
    log: log,
    error: error,
    info: info,
    debug: debug,
    warn: warn
}

function selectLogger() {
	if(consoleOutput) {
		return consoleExportObj
	} else {

        //log into some db
	}
}

module.exports = selectLogger()