<template>
  <div>
    <div class="girl-card__wrap">
      <waterfall
        :img-list="girlsList"
        :waterfall-img-col="4"
        img-key="img"
        :key="key"
        @resize1="resize"
        @update="update"
      >
        <template v-slot="{ info }">
          <div
            class="img-item-wrap"
            :style="{ backgroundColor: info.holdColor }"
          >
            <img class="lozad img-item" :data-src="info.img" alt="" />
            <div class="desc">{{ info.desc }}</div>
          </div>
        </template>
      </waterfall>
      <!-- <div class="girl-card__item" v-for="item in girlsList" :key="item._id">
        <div class="girl-card__top">
          <img
            class="girl-card__img"
            v-for="(imgItem, index) in item.images"
            :key="index"
            :src="imgItem"
            alt=""
          />
        </div>
      </div> -->
    </div>

    <ab-btn
      v-if="!noMore"
      :loading="loading"
      @cclick="lodeMore"
      class="btn"
      autofocus
      name="aibing"
    >
      {{ loadText }}
    </ab-btn>
    <div class="no-more" v-else>到底了~~~</div>
  </div>
</template>

<style lang="scss">
.girl-card {
  &__wrap {
    width: 100%;
  }
}

.lozad {
  height: 100%;
}

.img-item-wrap {
  height: 100%;
  overflow: hidden;
}
.img-item {
  transition: all 0.5s;
  &:hover {
    transform: scale(1.2);
  }
}
.btn {
  margin-top: 60px;
  margin-bottom: 30px;
  line-height: 40px;
  font-size: 20px;
  padding: 0 30px;
  // background: #6666cc;
  background: #000000;
  color: #ffffff;
  border-radius: 20px;
  outline: none;
  box-shadow: 2px 2px 5px #333333;
  border: none;
}

.desc {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-size: 1.6vw;
}
.no-more {
  font-size: 20px;
  padding: 30px;
}
// .girl-card {
//   &__wrap {
//     padding: 10px;
//     position: relative;
//     margin: 0 auto;
//     columns: 200px;
//     /* 每列每个元素最小的宽度 */
//     column-gap: 20px;
//     /* 每列的距离，不设置这个可以通过margin来设置边距 */
//   }
//   &__item {
//     // width: 50%;
//     break-inside: avoid; /* 这个是设置多列布局页面下的内容盒子如何中断，如果不加上这个，每列的头个元素就不会置顶，配合columns使用 */
//     margin-bottom: 15px; /* 如果是非图片瀑布流的话就加上背景吧，不然感觉不太好看。 */ /* background:dodgerblue; */
//     color: white;
//     border-radius: 5px;
//   }
//   &__img {
//     width: 100%; /* 建议每个图片宽高为100%，如果不设置宽高，就会溢出外层盒子的，或者设置固定宽度，最好不要宽过外层盒子或者高过外层盒子。这里说的外层盒子就是html代码里的 .box */
//     height: 100%;
//     border-radius: 5px;
//     border: 1px solid #ccc;
//     box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//   }
// }
</style>

<script>
import { getGirlsList } from "@/api/index";
import {
  ref,
  reactive,
  watchEffect,
  watch,
  computed,
  onMounted,
  onUnmounted,
  nextTick
} from "vue";
import { throttle } from "@/utils";
import abBtn from "@/components/ab-btn.vue";
import waterfall from "@/components/waterfall.vue";
import lozad from "lozad";
// import { useStore } from "vuex";
let a;
let observer;

export default {
  components: {
    abBtn,
    waterfall
  },
  setup(props, context) {
    console.log(context);
    const key = ref(0);
    const loading = ref(false);
    const noMore = ref(false);
    const holdColor = () => {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
      return color;
    };

    const page = reactive({
      num: 10,
      page: 1
    });

    let girlsList = reactive([]);

    function lodeMore() {
      if (noMore.value) return;
      loading.value = true;

      getGirlsList({
        page: page.page,
        count: page.num
      })
        .then(res => {
          loading.value = false;

          if (!res.data.data.length) {
            noMore.value = true;
          }
          const arr = res.data.data.map(x => {
            x.img = x.images[0];
            x.holdColor = holdColor();
            return x;
          });
          girlsList.push(...arr);
          page.page++;
          console.log(arr);
        })
        .catch(() => {
          loading.value = false;
        });
    }

    const loadText = computed(() => {
      return loading.value ? "加载中..." : "加载更多";
    });

    console.log(context);
    watchEffect(onInvalidate => {
      console.log("update");

      onInvalidate(() => {
        console.log("clear");
      });
    });

    watch(girlsList, (n, o) => {
      console.log(n, o);
    });

    watch(
      () => page.page,
      (n, o) => {
        console.log(n, o);
      }
    );

    function update() {
      nextTick(() => {
        if (observer && observer.observe) {
          observer.observe();
        } else {
          observer = lozad(); // lazy loads elements with default selector as '.lozad'
          observer.observe();
        }
      });
    }

    function resize(e) {
      girlsList = e;
      nextTick(() => {
        key.value++;
      });
    }

    function autoLoad(el, cb) {
      function check() {
        const relHeight =
          document.documentElement.clientHeight +
          document.documentElement.scrollTop;

        const scrollHeight = document.documentElement.scrollHeight;
        return relHeight + 100 >= scrollHeight;
      }

      const twrite = throttle(write, 300);
      function write() {
        console.log(document.documentElement.clientHeight);
        console.log(document.documentElement.scrollTop);
        console.log(document.documentElement.scrollHeight);
        if (check()) {
          cb();
        }
      }

      if (check()) {
        cb();
      }

      el.addEventListener("scroll", twrite);

      return {
        off() {
          el.removeEventListener("scroll", twrite);
        }
      };
    }

    onMounted(() => {
      a = autoLoad(document, function() {
        lodeMore();
      });
    });

    onUnmounted(() => {
      a.off();
    });

    return {
      lodeMore,
      loadText,
      loading,
      noMore,
      girlsList,
      key,
      resize,
      update
    };
  }
};
</script>
