<script setup lang="ts">
import { LngLatBounds, Map as MglMap } from "maplibre-gl"
import { GeoserverService } from "~/services/api/geoserver"

const mglMap = shallowRef<MglMap>()
const selectedLayer = ref<{ layer: string, workspace: string }>()
const availableLayer = ref<{ layer: string, workspace: string }[]>()
const layers = ref<{ layer: string, workspace: string, visible: boolean, id: string }[]>([])

function generateDefaultParamsGeoserver(layer: string, workspace: string) {
  return [
    `http://localhost:8080/geoserver/${workspace}/wms` +
    "?service=WMS" +
    "&request=GetMap" +
    "&version=1.1.0" +
    `&layers=${workspace}:${layer}` +
    "&format=image/png" +
    "&transparent=true" +
    "&srs=EPSG:3857" +
    "&bbox={bbox-epsg-3857}" +
    "&width=256" +
    "&height=256"
  ]
}

function initializeMap() {
  mglMap.value = new MglMap({
    container: "map",
    style: {
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        "osm-tiles": {
          type: "raster",
          tiles: [
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "osm-layer",
          type: "raster",
          source: "osm-tiles",
          minzoom: 0,
          maxzoom: 19
        },
      ]
    },
    bounds: [106.639, -6.38209, 107.008, -6.07012]
  })
}

onMounted(async () => {
  await initializeMap()
  await fetchListLayer()
})

async function fetchListLayer() {
  try {
    const data = await GeoserverService.getLayers()
    availableLayer.value = data.map(({ name }) => {
      const splitName = name.split(":")

      return {
        layer: splitName[1] as string,
        workspace: splitName[0] as string
      }
    })
  } catch (e) {
    console.error(e)
  }
}

function addLayer() {
  if (!mglMap.value || !selectedLayer.value) return

  const sourceName = `${selectedLayer.value?.workspace}-${selectedLayer.value?.layer}`
  mglMap.value.addSource(sourceName, {
    type: "raster",
    tiles: generateDefaultParamsGeoserver(selectedLayer.value.layer, selectedLayer.value.workspace)
  })

  mglMap.value.addLayer({
    id: sourceName,
    type: "raster",
    source: sourceName
  })

  layers.value.push({
    id: sourceName,
    layer: selectedLayer.value?.layer,
    workspace: selectedLayer.value?.workspace,
    visible: true
  })
}

function removeLayer(id: string) {
  if (!mglMap.value) return

  if (mglMap.value.getLayer(id)) {
    mglMap.value.removeLayer(id)
  }

  if (mglMap.value.getSource(id)) {
    mglMap.value.removeSource(id)
  }

  layers.value = layers.value.filter(l => l.id !== id)
}

function toggleLayer(id: string) {
  if (!mglMap.value) return

  const layer = layers.value.find((layer) => layer.id === id)
  if (!layer) return

  const visibility = layer.visible ? 'visible' : 'none'
  mglMap.value.setLayoutProperty(layer.id, 'visibility', visibility)
}


</script>

<template>
  <div class="absolute top-4 left-4 z-50 flex flex-col gap-2
        ">

    <div class="bg-white/90 rounded-xl
           p-4 flex items-center gap-3">
      <Dropdown v-model="selectedLayer" :options="availableLayer" optionLabel="layer"
        placeholder="Select GeoServer layer" class="w-64" />

      <Button label="Add" @click="addLayer" :disabled="!selectedLayer" />
    </div>

    <div class="bg-white text-black shadow p-3 w-64 rounded-xl" v-if="layers.length > 0">
      <h3 class="font-semibold mb-2">Added Layers</h3>

      <ul class="space-y-2">
        <li v-for="layer in layers" :key="layer.id" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Checkbox v-model="layer.visible" binary @change="toggleLayer(layer.id)" />
            <span class="text-sm">{{ layer.layer }}</span>
          </div>

          <Button icon="i-[hugeicons--delete-01]" severity="danger" text @click="removeLayer(layer.id)" />
        </li>
      </ul>
    </div>
  </div>

  <div id="map" style="width: 100vw; height: 100vh;"></div>
</template>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
