<template>
  <div>
    <div>{{ count }}</div>
    <div>{{ object }}</div>
    <div class="arr">{{ arr }}</div>
    <button @click="add">+</button>
    <input v-model="object.name" />
    <div v-for="(item, index) in jockList" :key="index">{{ item.title }}</div>
    <ab-btn
      :loading="loading"
      @cclick="lodeMore"
      class="btn"
      autofocus
      name="aibing"
    >
      {{ loadText }}
    </ab-btn>

    <div ref="dom">{{ userName }}</div>
    <input type="text" v-model="userName" />
    <form action="//mmzj.com" method="post">
      <input type="file" name="fileList" multiple />
      <input type="file" name="file" />
      <input type="text" name="name" />
      <input type="num" name="age" />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script>
import { getJockList, getGirlsList } from "@/api/index";
import {
  ref,
  reactive,
  watchEffect,
  watch,
  computed,
  onMounted,
  unref
} from "vue";
import abBtn from "@/components/ab-btn.vue";
import { useStore } from "vuex";
export default {
  components: {
    abBtn
  },
  setup(props, context) {
    console.log(context);
    const count = ref(0);
    const dom = ref(null);
    let loading = ref(false);
    let jockList = ref([]);
    const object = reactive({
      name: "ab",
      value: 0
    });

    const page = reactive({
      num: 10,
      page: 1
    });
    const arr = reactive([]);

    const store = useStore();
    const userName = computed({
      get: () => {
        return store.state.userName;
      },
      set: val => {
        store.commit("setUserName", val);
      }
    });
    console.log(userName);

    function lodeMore() {
      loading.value = true;
      getJockList({
        num: page.num,
        page: page.page
      })
        .then(res => {
          loading.value = false;
          jockList.value.push(...res.data.data.data);
          // jockList.value = res.data.data.data;
        })
        .catch(() => {
          loading.value = false;
        });

      getGirlsList({
        page: page.page,
        count: page.num
      }).then(res => {
        console.log(res);
        page.page++;
      });
    }

    const loadText = computed(() => {
      return loading.value ? "加载中..." : "加载更多";
    });

    // lodeMore();
    function lodeMore1(e) {
      console.log(e);
      debugger;
    }
    let timer = null;
    function add() {
      // for (let index = 0; index < 1000; index++) {
      //   count.value++;
      // }
      count.value++;
      arr.push(1);
      timer = setTimeout(() => {
        object.value++;
      }, 2000);
    }
    console.log(this);
    console.log(context);
    console.log(count);
    console.log(object);
    watchEffect(onInvalidate => {
      console.log("update");
      // if (object.name === "aibing") {
      //   object.name = "艾兵";
      // }
      function a() {
        return object.name + count.value;
      }
      onInvalidate(() => {
        console.log("clear");
        console.log(timer);
        clearTimeout(timer);
      });
      console.log(a());
    });

    watch(count, (o, n) => {
      console.log(o, n);
    });

    watch(arr, (n, o) => {
      console.log(n, o);
    });

    function autoLoad(el, cb) {
      function check() {
        const relHeight =
          document.documentElement.clientHeight +
          document.documentElement.scrollTop;

        const scrollHeight = document.documentElement.scrollHeight;
        return relHeight >= scrollHeight;
      }

      if (check()) {
        cb();
      }

      el.addEventListener("scroll", function() {
        console.log(document.documentElement.clientHeight);
        console.log(document.documentElement.scrollTop);
        console.log(document.documentElement.scrollHeight);
        if (check()) {
          cb();
        }
      });
    }

    onMounted(() => {
      const dom1 = unref(dom);
      dom1.style.background = "red";
      autoLoad(document, function() {
        lodeMore();
      });
    });
    return {
      count,
      object,
      add,
      jockList,
      lodeMore,
      lodeMore1,
      loadText,
      loading,
      userName,
      dom,
      arr
    };
  }
};
</script>
