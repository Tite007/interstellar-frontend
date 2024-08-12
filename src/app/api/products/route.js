import ConnectMongoDB from "@/src/utils/mongodb"


export async function POST() {
    await ConnectMongoDB()

    const res = await fetch('http://localhost:3001/products/addProduct', {
        
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time: new Date().toISOString() }),
    })
   
    const data = await res.json()
   
    return Response.json(data)
  }