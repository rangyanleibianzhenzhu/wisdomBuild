<!-- 地图定位组件 -->
<template>
  <div class="map-container">
    <div class="loading" v-if="loading">
      <BaseSpinner spinner="circles"></BaseSpinner>
    </div>
    <div :id="'amap_' + id" class="map-content">
    </div>
  </div>
</template>
<script>
// https://lbs.amap.com/api/webservice/summary
import BaseSpinner from '@/components/base/spinner'
import { generateUUID, loadScript } from '@/assets/js/utils.js'
import amapConf from './amap-conf.js'
export default {
  name: 'AMap',
  components: {
    BaseSpinner
  },
  props: {
    // 位置信息
    value: {
      type: Object
    },
    // 是否可编辑（即更改位置数据）
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      curValue: this.value && this.value.lat && this.value.lng ? this.value : null,
      id: generateUUID(),
      loading: false
    }
  },
  watch: {
    value (val) {
      this.curValue = val
    }
  },
  mounted () {
    this.showMap()
  },
  methods: {
    showMap () {
      this.loading = true
      this.loadScripts().then((result) => {
        // console.log('############# loadScripts', result)
        result && this.initMap()
      })
    },
    initMap () {
      let map = new window.AMap.Map('amap_' + this.id, {
        resizeEnable: true,
        zoom: 14
      })
      map.on('complete', () => {
        this.loading = false
      })

      if (this.editable) {
        window.AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], (PositionPicker, PoiPicker) => {
          let picker = new PositionPicker({
            map,
            mode: 'dragMap'
          })
          picker.on('success', (positionResult) => {
            let value = {
              address: positionResult.address,
              lat: positionResult.position.lat,
              lng: positionResult.position.lng
            }
            this.curValue = value
            this.$emit('changePosition', value)
            this.$emit('input', value)
            // console.log('定位成功: ', positionResult)
          })
          if (this.curValue) {
            // console.log('picker.start([this.curValue.lng, this.curValue.lat])', this.curValue.lng, this.curValue.lat)
            picker.start([this.curValue.lng, this.curValue.lat])
          } else {
            picker.start()
          }
        })
      } else {
        let value = this.curValue // { address: '北京市东城区东华门街道天安门广场', lat: 39.906504, lng: 116.397732 }
        if (value) {
          let position = [this.curValue.lng, this.curValue.lat]
          let marker = new window.AMap.Marker({
            position: position,
            title: value.address
          })
          marker.setMap(map)
          marker.on('click', () => {
            this.$toast({ position: 'top', message: value.address })
          })
          map.setCenter(position)
        }
      }
    },
    // 加载脚本
    loadScripts () {
      return loadScript('http://webapi.amap.com/maps?v=1.4.8&key=' + amapConf.key, 'amap_maps').then(() => {
        return loadScript('http://webapi.amap.com/ui/1.0/main.js?v=1.0.11', 'amap_ui').then(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (!window.AMap) {
                console.error('地图加载失败！')
                resolve(false)
              } else {
                resolve(true)
              }
            }, 100)
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.map-container {
  .map-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .loading {
    text-align: center;
    height: 300px;
  }
}
</style>
