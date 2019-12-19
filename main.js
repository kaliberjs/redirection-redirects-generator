const csv = require('csvtojson')
const fs = require('fs')
const { file: filePath } = require('minimist')(process.argv.slice(2))

if (!filePath) exit('No file path was passed in, make sure you supply it. Example `yarn generate-file --file=scripts/example.csv`')

const DEFAULT_DATA = {
  'plugin': {
    'version': '4.5.1',
    'date': new Date().toGMTString()
  },
  'groups': [],
  'redirects': [],
}

generateRedirectionImportJSONFile()

async function generateRedirectionImportJSONFile() {
  const csvDataRaw = await csv({
    headers: ['oldUrl', 'newUrl'],
    noheader: true,
    quote: 'off',
    trim: true,
  }).fromFile(filePath)

  const data = {
    ...DEFAULT_DATA,
    redirects: csvDataRaw.map(
      ({ oldUrl, newUrl }, index) => generateRedirectEntryData({
        index: index + 1,
        oldUrl,
        newUrl
      })
    )
  }

  fs.writeFileSync(`./redirects-${Date.now()}.json`, JSON.stringify(data))
}

function generateRedirectEntryData({ index, oldUrl, newUrl }) {
  return {
    'id': index,
    'url': oldUrl,
    'match_url': stripTrailingSlash(oldUrl),
    'match_data': {
      'source': {
        'flag_query': 'pass',
        'flag_case': false,
        'flag_trailing': true,
        'flag_regex': false
      }
    },
    'action_code': 301,
    'action_type': 'url',
    'action_data': {
      'url': newUrl
    },
    'match_type': 'url',
    'title': '',
    'hits': 0,
    'regex': false,
    'group_id': 1,
    'position': index - 1,
    'last_access': '-',
    'enabled': true,
  }
}

function stripTrailingSlash(x) {
  return x.substr(-1) === '/' ? x.substr(0, x.length - 1) : x
}
