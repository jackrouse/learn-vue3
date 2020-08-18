<template>
  <div
    class="v-waterfall-content"
    :style="{ height: maxHeight + 'px' }"
    id="v-waterfall"
  >
    <div
      v-for="(img, index) in state.waterfallList"
      :key="index"
      class="v-waterfall-item"
      :style="{
        top: img.top + 'px',
        left: img.left + 'px',
        width: state.relWidth + 'px',
        height: img.height + 'px'
      }"
    >
      <slot v-bind="img"></slot>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, watch, computed, onUnmounted } from "vue";
import { dobounce } from "@/utils";
export default {
  name: "v-waterfall",
  // setup(){

  // }
  props: {
    imgList: Array,
    imgKey: {
      type: String,
      default: "img"
    },
    waterfallImgWidth: {
      type: Number
      // default: 100
    },
    waterfallImgCol: {
      type: Number,
      default: 5
    },
    waterfallImgRight: {
      type: Number,
      default: 10
    },
    waterfallImgBottom: {
      type: Number,
      default: 10
    }
  },
  setup(props, context) {
    let prevArr = [];
    if (props.imgList.length) {
      imgPreloading(props.imgList);
    }
    const state = reactive({
      waterfallList: [],
      relWidth: 100,
      relCol: 5,
      // waterfallImgWidth: 100,
      // waterfallImgCol: 5,
      // waterfallImgRight: 10,
      // waterfallImgBottom: 10,
      waterfallDeviationHeight: []
    });

    //计算每个图片的宽度或者是列数
    function calculationWidth() {
      let domWidth = document.getElementById("v-waterfall").offsetWidth;
      if (!props.waterfallImgWidth && props.waterfallImgCol) {
        state.relWidth =
          (domWidth - props.waterfallImgRight * (props.waterfallImgCol - 1)) /
          props.waterfallImgCol;
        state.relCol = props.waterfallImgCol;
      } else if (props.waterfallImgWidth && !props.waterfallImgCol) {
        state.relCol = Math.floor(
          domWidth / (props.waterfallImgWidth + props.waterfallImgRight)
        );
        state.relWidth = props.waterfallImgWidth;
      }
      //初始化偏移高度数组
      state.waterfallDeviationHeight = new Array(state.relCol);
      for (let i = 0; i < state.waterfallDeviationHeight.length; i++) {
        state.waterfallDeviationHeight[i] = 0;
      }
      // imgPreloading();
    }
    //图片预加载

    function loadImg(src) {
      return new Promise(resolve => {
        let aImg = new Image();
        aImg.src = src;
        aImg.onload = aImg.onerror = () => {
          resolve(aImg);
        };
      });
    }

    function imgPreloading(arr) {
      const arrp = [];
      for (let i = 0; i < arr.length; i++) {
        arrp.push(loadImg(arr[i][props.imgKey]));
        // let aImg = new Image();
        // aImg.src = arr[i][props.imgKey];

        // let imgData = {};
        // imgData.info = arr[i];
        // imgData.height = 0;
        // state.waterfallList.push(imgData);

        // aImg.onload = aImg.onerror = () => {
        //   imgData.height = (state.relWidth / aImg.width) * aImg.height;
        //
        //   rankImg(imgData);
        // };
      }
      Promise.all(arrp).then(res => {
        console.log(res);
        res.forEach((x, y) => {
          let imgData = {};
          imgData.info = arr[y];
          imgData.height = (state.relWidth / x.width) * x.height;
          state.waterfallList.push(imgData);
          rankImg(imgData);
        });
        context.emit("update", state.waterfallList);
      });
    }

    //瀑布流布局
    function rankImg(imgData) {
      // let {
      //   relWidth,
      //   waterfallImgRight,
      //   waterfallImgBottom,
      //   waterfallDeviationHeight
      // } = this;
      //for (let i = 0;i < this.waterfallList.length;i++){
      let minIndex = filterMin();
      imgData.top = state.waterfallDeviationHeight[minIndex];
      imgData.left = minIndex * (props.waterfallImgRight + state.relWidth);
      state.waterfallDeviationHeight[minIndex] +=
        imgData.height + props.waterfallImgBottom;
      //}
      console.log(imgData);
    }
    /**
     * 找到最短的列并返回下标
     * @returns {number} 下标
     */
    function filterMin() {
      const min = Math.min.apply(null, state.waterfallDeviationHeight);
      return state.waterfallDeviationHeight.indexOf(min);
    }

    const maxHeight = computed(() => {
      return Math.max.apply(null, state.waterfallDeviationHeight);
    });

    onMounted(() => {
      const cw = document.documentElement.clientWidth;
      calculationWidth();
      window.onresize = dobounce(function() {
        const rcw = document.documentElement.offsetWidth;
        if (cw === rcw) {
          return;
        }
        // calculationWidth();
        // state.waterfallList = [];
        // imgPreloading(props.imgList);
        context.emit("resize1", props.imgList);
      }, 500);
    });

    onUnmounted(() => {
      window.onresize = null;
    });

    watch(props.imgList, n => {
      // console.log(n, o);
      const oldLength = prevArr.length;
      const arr = n.slice(oldLength);
      imgPreloading(arr);

      prevArr = n.concat([]);
    });

    return {
      state,
      maxHeight
    };
  }
};
</script>

<style>
.v-waterfall-content {
  width: 100%;
  height: 100%;
  position: relative;
}
.v-waterfall-item {
  float: left;
  position: absolute;
}
.v-waterfall-item img {
  width: 100%;
  /* height: auto; */
  display: block;
}
</style>
