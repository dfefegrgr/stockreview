<template>
  <div class="box" style="color:#414040">
    <label>股票代码</label>
    <input type="text" v-model="code">
    <label>开始日期</label>
    <input type="date" v-model="start">
    <label>结束日期</label>
    <input type="date" v-model="end" style="margin-bottom: 10px">
    <button @click="getData" style="background-color: #484747;color: white;font-size: 16px;border: none">搜索</button>
  </div>
  <div id="main"></div>
</template>

<script>
import * as echarts from 'echarts/core';
import {BarChart, CandlestickChart, LineChart} from 'echarts/charts';
import {
  TitleComponent,
  GraphicComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  DataZoomComponent,
  TransformComponent
} from 'echarts/components';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import axios from "axios";
import {ref} from "vue";

export default {
  data() {
    this.myChart = null
    return {
      stockData: [],
      code: '603123',
      start: '2021-10-05',
      end: '2022-01-05',
      name: ''
    }
  },
  methods: {
    async getData() {
      const input = ref({code: this.code, start: this.start, end: this.end})
      await axios.post('/stock_his_day', input.value)
          .then((res) => {
            this.stockData = res.data
          });
      await axios.post('/stock_info', input.value)
          .then((res) => {
            this.name = res.data
          });
      this.drawStock()
    },

    drawStock() {
      var option;
      const data0 = splitData(this.stockData);

      function calculateMA(dayCount) {
        var result = [];
        for (var i = 0, len = data0.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-');
            continue;
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            sum += +data0.values[i - j][1];
          }
          result.push((sum / dayCount).toFixed(2));
        }
        return result;
      }


      function splitData(inData) {
        let rawData = []
        for (let idx in inData) {
          let vs = []
          vs.push(inData[idx].date)
          vs.push(inData[idx].volume)
          vs.push(inData[idx].p_change)
          vs.push(inData[idx].open)
          vs.push(inData[idx].close)
          vs.push(inData[idx].low)
          vs.push(inData[idx].high)
          rawData.push(vs)
        }
        const categoryData = [];
        const values = [];
        const volume = [];
        const priceChange = [];
        for (var i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].splice(0, 1)[0]);
          volume.push(rawData[i].splice(0, 1)[0])
          priceChange.push(rawData[i].splice(0, 1)[0])
          values.push(rawData[i]);
          console.log(priceChange)

        }
        return {
          categoryData: categoryData,
          volume: volume,
          priceChange: priceChange,
          values: values
        };
      }

      option = {
        title: {
          text: "代码："+this.code + "  名称：" + this.name.name,
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          },
          formatter: '{b3}<br> 涨跌幅:{c3}<br>'
        },
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all'
            }
          ]
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              type: 'jpeg',
              title: '保存图片'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: data0.categoryData,
            boundaryGap: false,
            axisLine: {lineStyle: {color: '#777'}},
            axisPointer: {
              z: 100
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: data0.categoryData,
            boundaryGap: false,
            splitLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            axisLine: {lineStyle: {color: '#777'}},
            axisPointer: {show: false}
          },
          {
            type: 'category',
            gridIndex: 2,
            data: data0.categoryData,
            boundaryGap: false,
            splitLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            axisLine: {show: false},
            axisPointer: {opacity: 0}
          }
        ],
        yAxis: [
          {
            scale: true,
            splitNumber: 2,
            axisLine: {lineStyle: {color: '#777'}},
            splitLine: {show: true},
            axisTick: {show: false},
            axisLabel: {
              inside: true,
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            gridIndex: 2,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          },
        ],
        grid: [
          {
            left: 14,
            right: 14,
            top: 110,
            height: 220
          },
          {
            left: 14,
            right: 14,
            height: 80,
            top: 360
          },
          {
            left: 14,
            right: 14,
            top: 110,
            height: 220
          },
        ],
        series: [
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            itemStyle: {
              color: '#7fbe9e'
            },
            emphasis: {
              itemStyle: {
                color: '#140'
              }
            },
            data: data0.volume,
          },
          {
            name: '日K',
            type: 'candlestick',
            data: data0.values,

          },
          {
            name: '涨跌幅',
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            itemStyle: {
              opacity: 0
            },
            data: data0.priceChange,
            barMaxHeight: 0,
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
          }
        ]
      };
      option && this.myChart.setOption(option);
    },
  },
  created() {
    echarts.use([
      TitleComponent,
      GraphicComponent,
      TooltipComponent,
      ToolboxComponent,
      GridComponent,
      LegendComponent,
      DataZoomComponent,
      DatasetComponent,
      TransformComponent,
      BarChart,
      CandlestickChart,
      LineChart,
      LabelLayout,
      UniversalTransition,
      CanvasRenderer
    ]);
  },
  mounted() {
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/component/grid');
    require('echarts/lib/chart/candlestick');
    var chartDom = document.getElementById('main');
    this.myChart = echarts.init(chartDom);
  }


}
</script>
<style>
#main {
  width: 1000px;
  height: 550px;
  margin: auto;
}

.box {
  display: flex;
  flex-direction: column;
  width: 200px;
  margin: auto;

}
</style>
