import express from 'express'
import * as cheerio from 'cheerio'

const app = express()
const PORT = 3001

app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Fetch headers for oid-base.com
const fetchHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

// Parse OID info from a cheerio-loaded page
function parseOidInfo($, oid) {
  const result = {
    oid,
    name: '',
    description: '',
    asnNotation: '',
    iriNotation: ''
  }

  // Look for the OID name/description in various places
  const pageTitle = $('h1').first().text().trim()
  if (pageTitle && pageTitle !== oid) {
    result.name = pageTitle
  }

  // Look for ASN.1 notation - usually in a code block or specific element
  $('code, pre, .asn1').each((_, el) => {
    const text = $(el).text().trim()
    if (text.includes('{') && text.includes('}') && text.includes('(')) {
      result.asnNotation = text
    }
  })

  // Look for IRI notation
  $('code, pre').each((_, el) => {
    const text = $(el).text().trim()
    if (text.startsWith('/') && !text.includes(' ')) {
      result.iriNotation = text
    }
  })

  // Look for description in paragraphs or definition lists
  const descriptionEl = $('p').first()
  if (descriptionEl.length) {
    const desc = descriptionEl.text().trim()
    if (desc && desc.length > 0 && desc.length < 500) {
      result.description = desc
    }
  }

  // Try definition lists
  $('dt').each((_, dt) => {
    const label = $(dt).text().trim().toLowerCase()
    const dd = $(dt).next('dd')
    const value = dd.text().trim()

    if (label.includes('name') || label.includes('identifier')) {
      if (!result.name) result.name = value
    } else if (label.includes('description')) {
      result.description = value
    } else if (label.includes('asn')) {
      result.asnNotation = value
    } else if (label.includes('iri')) {
      result.iriNotation = value
    }
  })

  // If we still don't have a name, use the OID itself
  if (!result.name) {
    result.name = oid
  }

  return result
}

// Lookup single OID
app.get('/api/lookup/:oid', async (req, res) => {
  const oid = req.params.oid

  try {
    const response = await fetch(`https://oid-base.com/get/${oid}`, {
      headers: fetchHeaders
    })

    if (!response.ok) {
      return res.status(404).json({ error: 'OID not found' })
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const result = parseOidInfo($, oid)

    res.json(result)
  } catch (error) {
    console.error('Lookup error:', error)
    res.status(500).json({ error: 'Failed to fetch OID information' })
  }
})

// Fetch children of an OID
app.get('/api/children/:oid', async (req, res) => {
  const parentOid = req.params.oid

  try {
    const response = await fetch(`https://oid-base.com/get/${parentOid}`, {
      headers: fetchHeaders
    })

    if (!response.ok) {
      return res.status(404).json({ error: 'OID not found' })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const children = []
    const parentPrefix = parentOid + '.'

    // Find all links that could be child OIDs
    // oid-base.com typically lists children as links with the OID in the href or text
    $('a').each((_, el) => {
      const href = $(el).attr('href') || ''
      const text = $(el).text().trim()

      // Check if this is a link to a child OID
      // Links are typically like /get/1.2.3.4 or contain the OID
      const hrefMatch = href.match(/\/get\/([\d.]+)/)
      if (hrefMatch) {
        const childOid = hrefMatch[1]
        // Check if it's a direct child (starts with parent and has one more segment)
        if (childOid.startsWith(parentPrefix)) {
          const remainder = childOid.slice(parentPrefix.length)
          // Direct child has no more dots
          if (!remainder.includes('.')) {
            // Get the name from the link text or surrounding context
            let name = text
            // Clean up the name - remove the OID if it's just showing the OID
            if (name === childOid || name.match(/^[\d.]+$/)) {
              // Try to get name from parent element or sibling
              const parent = $(el).parent()
              const siblingText = parent.text().replace(childOid, '').trim()
              if (siblingText && siblingText.length < 100) {
                name = siblingText.replace(/^[:\-–\s]+/, '').trim()
              }
            }

            // Avoid duplicates
            if (!children.find(c => c.oid === childOid)) {
              children.push({
                oid: childOid,
                name: name || childOid,
                description: ''
              })
            }
          }
        }
      }
    })

    // Also look for OIDs in table cells or list items
    $('li, td').each((_, el) => {
      const text = $(el).text().trim()
      // Match OID patterns that are children of the parent
      const oidMatch = text.match(new RegExp(`(${parentOid.replace(/\./g, '\\.')}\\.\\d+)(?:\\s|$|[^\\d])`))
      if (oidMatch) {
        const childOid = oidMatch[1]
        const remainder = childOid.slice(parentPrefix.length)
        if (!remainder.includes('.') && !children.find(c => c.oid === childOid)) {
          // Extract name - everything after the OID
          let name = text.replace(childOid, '').trim()
          name = name.replace(/^[:\-–\s]+/, '').trim()
          if (name.length > 100) name = name.slice(0, 100) + '...'

          children.push({
            oid: childOid,
            name: name || childOid,
            description: ''
          })
        }
      }
    })

    // Sort children by OID
    children.sort((a, b) => {
      const aParts = a.oid.split('.').map(Number)
      const bParts = b.oid.split('.').map(Number)
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0
        const bVal = bParts[i] || 0
        if (aVal !== bVal) return aVal - bVal
      }
      return 0
    })

    res.json({
      parentOid,
      children,
      count: children.length
    })
  } catch (error) {
    console.error('Children fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch children' })
  }
})

app.listen(PORT, () => {
  console.log(`OID Proxy server running on http://localhost:${PORT}`)
})
