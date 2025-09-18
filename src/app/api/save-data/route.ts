import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { filename, data } = await request.json()
    
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'public', 'data')
    await mkdir(dataDir, { recursive: true })
    
    // Write data to JSON file
    const filePath = join(dataDir, filename)
    await writeFile(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
