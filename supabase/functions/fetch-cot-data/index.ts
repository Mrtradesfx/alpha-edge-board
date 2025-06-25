
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // CFTC COT data URL - using the short format CSV
    const cotUrl = 'https://www.cftc.gov/dea/newcot/f_year.txt'
    
    console.log('Fetching COT data from CFTC...')
    const response = await fetch(cotUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const csvText = await response.text()
    const lines = csvText.split('\n')
    
    // Skip header line and process data
    const dataLines = lines.slice(1).filter(line => line.trim())
    
    // Asset mapping for major currencies and commodities
    const assetMapping: Record<string, string> = {
      '099741': 'EUR', // Euro FX
      '096742': 'GBP', // British Pound
      '097741': 'JPY', // Japanese Yen
      '098662': 'CAD', // Canadian Dollar
      '092741': 'AUD', // Australian Dollar
      '001602': 'GC',  // Gold
      '002602': 'SI',  // Silver
      '067651': 'CL',  // Crude Oil WTI
      '054642': 'HO',  // Heating Oil
      '023651': 'NG',  // Natural Gas
    }
    
    const processedData = []
    
    for (const line of dataLines.slice(0, 50)) { // Process recent data
      const fields = line.split(',').map(field => field.replace(/"/g, '').trim())
      
      if (fields.length < 15) continue
      
      try {
        const cftcCode = fields[0]
        const reportDate = fields[2]
        const contractName = fields[1]
        
        // Only process assets we're tracking
        const assetSymbol = assetMapping[cftcCode]
        if (!assetSymbol) continue
        
        // Parse the date (YYYY-MM-DD format)
        const parsedDate = new Date(reportDate)
        if (isNaN(parsedDate.getTime())) continue
        
        const commercialLong = parseInt(fields[5]) || 0
        const commercialShort = parseInt(fields[6]) || 0
        const nonCommercialLong = parseInt(fields[9]) || 0
        const nonCommercialShort = parseInt(fields[10]) || 0
        const totalOpenInterest = parseInt(fields[14]) || 0
        
        const record = {
          report_date: reportDate,
          asset_symbol: assetSymbol,
          asset_name: contractName,
          commercial_long: commercialLong,
          commercial_short: commercialShort,
          commercial_net: commercialLong - commercialShort,
          non_commercial_long: nonCommercialLong,
          non_commercial_short: nonCommercialShort,
          non_commercial_net: nonCommercialLong - nonCommercialShort,
          total_open_interest: totalOpenInterest,
        }
        
        processedData.push(record)
      } catch (err) {
        console.error('Error processing line:', err)
        continue
      }
    }
    
    console.log(`Processed ${processedData.length} COT records`)
    
    // Insert data into database (upsert to handle duplicates)
    if (processedData.length > 0) {
      const { error } = await supabaseClient
        .from('cot_reports')
        .upsert(processedData, { 
          onConflict: 'report_date,asset_symbol',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error('Database error:', error)
        throw error
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processedData.length,
        message: `Successfully processed ${processedData.length} COT records`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
    
  } catch (error) {
    console.error('Error in fetch-cot-data function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
