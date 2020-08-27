import 'ol/ol.css';
import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style,Text} from 'ol/style';
import {OSM, Vector as VectorSource,VectorTile} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer,VectorTile as VectorTileLayer} from 'ol/layer';
import TileWMS from 'ol/source/TileWMS'
import {Projection,fromLonLat} from 'ol/proj'

import WMTS from 'ol/tilegrid/WMTS'
import GeometryCollection from 'ol/geom/geometrycollection';
import {defaults,MousePosition,Attribution,FullScreen,OverviewMap  } from 'ol/control'
import { toStringXY } from 'ol/coordinate';

var geojsonObject = {
    'type': 'FeatureCollection',
    'crs': {
      'type': 'name',
      'properties': {
        'name': 'EPSG:3857',
      },
    },
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 0],
        },
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [4e6, -2e6],
            [8e6, 2e6] ],
        },
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [4e6, 2e6],
            [8e6, -2e6] ],
        },
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [-5e6, -1e6],
              [-4e6, 1e6],
              [-3e6, -1e6] ] ],
        },
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiLineString',
          'coordinates': [
            [
              [-1e6, -7.5e5],
              [-1e6, 7.5e5] ],
            [
              [1e6, -7.5e5],
              [1e6, 7.5e5] ],
            [
              [-7.5e5, -1e6],
              [7.5e5, -1e6] ],
            [
              [-7.5e5, 1e6],
              [7.5e5, 1e6] ] ],
        },
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiPolygon',
          'coordinates': [
            [
              [
                [-5e6, 6e6],
                [-5e6, 8e6],
                [-3e6, 8e6],
                [-3e6, 6e6] ] ],
            [
              [
                [-2e6, 6e6],
                [-2e6, 8e6],
                [0, 8e6],
                [0, 6e6] ] ],
            [
              [
                [1e6, 6e6],
                [1e6, 8e6],
                [3e6, 8e6],
                [3e6, 6e6] ] ] ],
        },
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'GeometryCollection',
          'geometries': [
            {
              'type': 'LineString',
              'coordinates': [
                [-5e6, -5e6],
                [0, -5e6] ],
            },
            {
              'type': 'Point',
              'coordinates': [4e6, -5e6],
            },
            {
              'type': 'Polygon',
              'coordinates': [
                [
                  [1e6, -6e6],
                  [2e6, -4e6],
                  [3e6, -6e6] ] ],
            } ],
        },
      } ],
  };
var image = new CircleStyle({
    radius: 3,
    fill: new Fill({color:'red'}),
    stroke: new Stroke({color: 'red', width: 1}),
  });
  
  var styles = {
    'Point': new Style({
      image: image,
    }),
    'LineString': new Style({
      stroke: new Stroke({
        color: 'green',
        width: 3,
      }),
    }),
    'MultiLineString': new Style({
      stroke: new Stroke({
        color: 'green',
        width: 1,
      }),
    }),
    'MultiPoint': new Style({
      image: image,
    }),
    'MultiPolygon': new Style({
      stroke: new Stroke({
        color: 'yellow',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.1)',
      }),
    }),
    'Polygon': new Style({
        stroke: new Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3,
        }),
        fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
        }),
        text:new Text({
        offsetX:'-5',
        offsetY:'0',
        text:'test',
        fill:new Fill({
            color: 'rgba(255, 255, 0, 0.1)',
            }),
        })
    }),
    'GeometryCollection': new Style({
      stroke: new Stroke({
        color: 'magenta',
        width: 2,
      }),
      fill: new Fill({
        color: 'magenta',
      }),
      image: new CircleStyle({
        radius: 10,
        fill: null,
        stroke: new Stroke({
          color: 'magenta',
        }),
      }),
    }),
    'Circle': new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.2)',
      }),
    }),
  };

  var styleFunction = function (feature) {
    return styles[feature.getGeometry().getType()];
  };

  //创建一个wgs-84坐标系
  var projection = new Projection({
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'neu'
    });
  

const map = new Map({
  controls: new defaults({attribution: false}).extend([
    //坐标位置显示
    new MousePosition({
      //设置坐标格式
      coordinateFormat:(coord)=>{
        return toStringXY(coord,5);
      },
      className:'ol-mouse-position-customer'  //通过类字符串 （默认为“ ol-mouse-position”）找标签
    //projection：progection  //投影。默认为视图投影
    //render :  //类型：feature 在应重新呈现控件时调用的函数。这在requestAnimationFrame 回调中被调用。
    //target: "" //如果要使控件在地图视口之外呈现，请指定一个目标。
    //undefinedHTML:"" //标记以显示坐标何时不可用（例如，当指针离开地图视口时）。默认情况下，当指针离开视口时，最后一个位置将替换为'&#160;'（&nbsp;）。要保留最后渲染的位置，请将此选项设置为false（如空字符串''）。
    })
    ,
    //鹰眼图
    new OverviewMap({
      collapsible:false,//将可折叠关闭
      //className:'ol-overviewmap-customer',
      layers: [buildLocationGeoserverLayer('china')],
    })
    /**
     * 
    名称	类型	描述
    className	字符串 （默认为“ ol-overviewmap”）	
    CSS类名称。

    collapsed	布尔值 （默认为true）	
    控件是否应该开始折叠（展开）。

    collapseLabel	串 | HTMLElement （默认为“«”）	
    用于展开的总览图按钮的文本标签。除了文本之外，还可以使用元素（例如span元素）。

    collapsible	布尔值 （默认为true）	
    控件是否可以折叠。

    label	串 | HTMLElement （默认为“»”）	
    用于折叠的总览图按钮的文本标签。除了文本之外，还可以使用元素（例如span元素）。

    layers	Array。< module：ol / layer / Layer〜Layer > | module：ol / Collection〜Collection。< module：ol / layer / Layer〜Layer >	
    概览图的图层。

    render	功能	
    在应重新呈现控件时调用的函数。这在requestAnimationFrame回调中被调用。

    rotateWithView	布尔值 （默认为false）	
    控制视图是否应随主地图视图一起旋转。

    target	HTMLElement | 串	
    如果要使控件在地图视口之外呈现，请指定一个目标。

    tipLabel	字符串 （默认为“概述地图”）	
    用于按钮提示的文本标签。

    view	模块：ol / View〜View	
    概述地图的自定义视图（应使用与主地图相同的投影）。如果未提供，将使用与主地图具有相同投影的默认视图。
     */
    ,
    //全屏按钮
    new FullScreen({
      className:'ol-full-screen-customer'
    })
    /*
    名称	类型	描述
    options	
    选项。

    名称	类型	描述
    className	字符串 （默认为'ol-full-screen'）	
    CSS类名称。

    label	串 | 文字 （预设为'\ u2922'）	
    用于按钮的文本标签。除了文本之外，还可以使用元素（例如span元素）。

    labelActive	串 | 文字 （预设为'\ u00d7'）	
    全屏激活时用于按钮的文本标签。除了文本之外，还可以使用元素（例如span元素）。

    tipLabel	字符串 （默认为“切换全屏”）	
    用于按钮提示的文本标签。

    keys	布尔值 （默认为false）	
    完全键盘访问。

    target	HTMLElement | 串	
    如果要使控件在地图视口之外呈现，请指定一个目标。

    source	HTMLElement | 串	
    要全屏显示的元素。如果未提供，则包含地图视口的元素将全屏显示。
    */
  ]),
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [112, 34],          //设置view中心
    projection: projection,  //设置地图显示的坐标系为自定义的wgs-84坐标系
    zoom: 1                  //设置view放大倍数
  })
});

const view =map.getView();
var geojson=turf.randomPolygon(1,{bbox:[112,31,114,33]});
//var geojson=turf.randomLineString(10,{bbox:[110,25,114,33],num_vertices:80000});

//loadGeojson(geojsonObject);
//geojson=fromlatGeojson(geojson);

var geojsonLayer=loadGeojson(geojson);
map.getControls().array_[3].set('layers',[geojsonLayer]);
let geometrys=[];
for(var i in geojsonLayer.getSource().getFeatures()){
    geometrys.push(geojsonLayer.getSource().getFeatures()[i].getGeometry());
}

geometrys=new GeometryCollection(geometrys);

//移动view视角
view.fit(geometrys.getExtent(),{padding:[170, 50, 30, 150]});
/*或者是
var feature = source.getFeatures()[1];
    var point = feature.getGeometry();
    var size = map.getSize();
    view.centerOn(point.getCoordinates(), size, [570, 500]);

*/
// function loadGeojsonSource(geojson){
  
//     switch (typeof(geojson))
//     {
//       case "string":
//         if(new URL(geojson)){
//           var source=new VectorSource({
//             url: geojson,
//             format: new GeoJSON(),
//           })
//         }else{
//           var geojson=JSON.parse(geojson);
//           var source = new VectorSource({
//             features: new GeoJSON().readFeatures(geojson),
//             });
//         }
//         break;
//       case 'object':
//         var source = new VectorSource({
//           features: new GeoJSON().readFeatures(geojson),
//           });
//         break;
//     }
//     return source;
// }

// var source=loadGeojsonSource('https://openlayers.org/en/latest/examples/data/geojson/countries.geojson');
// console.log(source);
 function loadGeojson(geojson){
    var vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geojson),
    });
    var layer=new VectorLayer({
      source:vectorSource,
      style:styleFunction
    });
    map.addLayer(layer);
    return layer;
}

function buildLocationGeoserverLayer(LayerName){
    var layer=new TileLayer({
        visible: true,
        source: new TileWMS({
            url: 'http://127.0.0.1:8080/geoserver/wms',
            params: {
            'FORMAT': 'image/png', 
            'VERSION': '1.1.1',
            tiled: true,
            "LAYERS": LayerName,
            "exceptions": 'application/vnd.ogc.se_inimage'
            }
        })
    });
    return layer;
}

function getGeoserverURL(LayerName){
    var url='http://127.0.0.1:8080/geoserver/gwc/service/wmts?';

    var vectorParams = {
        'REQUEST': 'GetTile',
        'SERVICE': 'WMTS',
        'VERSION': '1.0.0',
        'LAYER': LayerName,
        'STYLE': '',
        'TILEMATRIX': 'EPSG:4326' + ':{z}',
        'TILEMATRIXSET': 'EPSG:4326',
        'FORMAT': 'application/json;type=geojson',
        'TILECOL': '{x}',
        'TILEROW': '{y}'
      };

      for (var param in vectorParams) {
        url = url + param + '=' + vectorParams[param] + '&';
      }
      url = url.slice(0, -1);
    return url;

}

function getGeoserverLayer(layerName){
    var projection = new Projection({
        code: 'EPSG:4326',
        units: 'degrees',
        axisOrientation: 'neu'
        });
    var resolutions=[0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625];
    var gridNames=["EPSG:4326:0", "EPSG:4326:1", "EPSG:4326:2", "EPSG:4326:3", "EPSG:4326:4", "EPSG:4326:5", "EPSG:4326:6", "EPSG:4326:7", "EPSG:4326:8", "EPSG:4326:9", "EPSG:4326:10", "EPSG:4326:11", "EPSG:4326:12", "EPSG:4326:13", "EPSG:4326:14", "EPSG:4326:15"];
    var source = new VectorTile({
        url: getGeoserverURL(layerName),
        format: new GeoJSON({}),
        projection: projection,
        tileGrid: new WMTS({
            tileSize: [256,256],
            origin: [-180.0, 90.0],
            resolutions: resolutions,
            matrixIds: gridNames
        }),
        wrapX: true
        });
        console.log(source);
    var layer = new VectorTileLayer({
        source: source
        });
    return layer;
}

function fromlatGeojson(geojson){
    var features=geojson.features;
    for(var i in geojson.features){
        var geometry=geojson.features[i].geometry;
         var coordinates=geojson.features[i].geometry.coordinates;
        switch(geometry.type){
            case 'Point':
            {
                coordinates=fromLonLat(coordinates);
                break;
            }
            case "LineString":
            {
                coordinates.forEach((coordinate,i)=>{
                    //coordinate=fromLonLat(coordinate);
                    coordinate=fromLonLat(coordinate)
                    coordinates[i]=coordinate;
                });
                break;
            }
            case "Polygon":
            {
                coordinates.forEach((coor)=>{
                    coor.forEach((coordinate,i)=>{
                        //coordinate=fromLonLat(coordinate);
                        coor[i]=fromLonLat(coordinate)
                    });
                });
                break;
            }
        
        }
        
        geojson.features[i].geometry.coordinates=coordinates;
    }
    return geojson;
}

var attribution = new Attribution({
  collapsible: false,
});
function checkSize() {
  var small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
}

window.addEventListener('resize', checkSize);
checkSize();

