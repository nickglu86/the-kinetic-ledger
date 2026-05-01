export const fetchData = async <T>(url: string, revalidate?: number): Promise<T> => {
   const response = await fetch(url,{ next: { revalidate: revalidate ?? 60 } });
   if(!response.ok){
    throw new Error(`Fetching from ${url} went bad, ${response.status}.`)
   }
   return response.json()
}

export const safeFetch = async <T>(url: string, revalidate?: number):Promise<T | null> => {
   try{  
      return await fetchData(url, revalidate);
   }catch{
      return null
   }

}
//   1. Call fetch(url, { next: { revalidate: revalidate ?? 60 } })
//   2. Check res.ok — if not, throw an error (include the URL and status in the message)
//   3. Return res.json() cast as T