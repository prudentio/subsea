import type { JSendBase } from "~/services/api/base"
import { useGeoserverFetch, useMainServiceFetch } from "~/services/api/base"

interface layer{
  layers:{
    layer:{
      name:string,
      href:string
    }[]
  }
}

async function getLayers() {
  const res = await useGeoserverFetch<layer>(`/layers.json`, {
    method: "GET",
  })

  return res.layers.layer
}

export const GeoserverService = {  getLayers}
