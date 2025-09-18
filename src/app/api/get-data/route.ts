import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }
    
    // Read data from JSON file
    const dataDir = join(process.cwd(), 'public', 'data')
    const filePath = join(dataDir, filename)
    
    try {
      const data = await readFile(filePath, 'utf8')
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData)
    } catch (fileError) {
      console.log(`File ${filename} not found, returning empty data`)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error reading data:', error)
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}
