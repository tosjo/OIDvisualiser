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

app.get('/api/lookup/:oid', async (req, res) => {
  const oid = req.params.oid

  try {
    const response = await fetch(`https://oid-base.com/get/${oid}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })

    if (!response.ok) {
      return res.status(404).json({ error: 'OID not found' })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Parse the page for OID information
    const result = {
      oid,
      name: '',
      description: '',
      asnNotation: '',
      iriNotation: ''
    }

    // Try to extract information from the page
    // The structure may vary, so we try multiple approaches

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

    res.json(result)
  } catch (error) {
    console.error('Lookup error:', error)
    res.status(500).json({ error: 'Failed to fetch OID information' })
  }
})

app.listen(PORT, () => {
  console.log(`OID Proxy server running on http://localhost:${PORT}`)
})
