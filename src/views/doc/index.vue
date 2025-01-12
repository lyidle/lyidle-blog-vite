<template>
  <layout-header />
  <layout-banner :context="false"></layout-banner>
  <layout-content :isAllAside="false" class="pages">
    <!-- 侧边栏 -->
    <template #aside-start v-if="article">
      <layout-content-aside-card>
        <template #title>
          <i class="i-material-symbols:menu-rounded"></i>
          <span>目录</span>
        </template>
        <template #body>fds </template>
      </layout-content-aside-card>
    </template>
    <!-- 内容区 -->
    <template #content-start v-if="article">
      <teleport to="body">
        <context-menu>
          <div class="doc-pages-header">
            <div class="container">
              <div class="title cur-text">{{ article?.title }}</div>
              <div class="author cur-text">作者--{{ article?.author }}</div>
              <div class="desc">
                <div class="item">
                  <div class="item-data">
                    <span class="label cur-text">
                      <i class="i-oui:token-date"></i>
                      发表于
                    </span>
                    <span class="content cur-text">{{
                      moment(article?.createdAt)
                    }}</span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mingcute:refresh-3-line"></i>更新于</span
                    >
                    <span class="content cur-text">{{
                      moment(article?.updatedAt)
                    }}</span>
                  </div>
                </div>

                <div class="item">
                  <div class="item-data">
                    <span class="label cur-text">
                      <i class="i-tabler:clover-filled"></i>
                    </span>
                    <span class="content cur-text doc-header-link cur-pointer">
                      <router-link
                        :to="`/user/categories?author=${article.author}&category=${article.category}`"
                        >{{ article?.category }}</router-link
                      >
                    </span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mynaui:label-solid"></i
                    ></span>
                    <span class="content">
                      <template
                        v-for="(item, index) in article?.tags"
                        :key="item"
                      >
                        <span class="doc-header-link cur-pointer">
                          <router-link
                            :to="`/user/tags?author=${article.author}&tags=${item}`"
                            >{{ item }}</router-link
                          >
                        </span>
                        <span
                          class="tags-doc"
                          v-if="index !== article?.tags.length - 1"
                          >·</span
                        >
                      </template>
                    </span>
                  </div>
                </div>
                <div class="item">
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-oui:token-date"></i>字数总计:</span
                    >
                    <span class="content cur-text">{{ article?.length }}</span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mingcute:refresh-3-line"></i>阅读时长:</span
                    >
                    <span class="content cur-text">1分钟</span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mingcute:refresh-3-line"></i>浏览量:</span
                    >
                    <span class="content cur-text">23208</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="header-animate">
              <animations-waves
                oneColor="var(--doc-header-waves-color-1)"
                twoColor="var(--doc-header-waves-color-2)"
                threeColor="var(--doc-header-waves-color-3)"
              ></animations-waves>
            </div>
          </div>
        </context-menu>
      </teleport>
      <!-- 卡片 -->
      <div class="doc-content">
        <my-card>
          <template #body>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            maxime, perspiciatis, perferendis optio sunt odit veniam natus qui
            fugit itaque, ut esse ab! Voluptatum, vero fugit nesciunt ipsam
            explicabo incidunt cupiditate rem odit dolorem vitae cum dignissimos
            porro harum sed sit quasi minus repellat consequuntur, cumque
            perspiciatis ipsa iure laborum quos? Eum natus, eaque quisquam,
            inventore facilis explicabo architecto accusantium in modi quod
            voluptatem ipsa qui? Exercitationem sapiente numquam consequuntur
            officia, magnam odio dicta omnis est, eum perspiciatis corporis?
            Quia possimus pariatur beatae reiciendis. Tempore laboriosam
            voluptatibus est quia aut necessitatibus ratione dolorum libero
            architecto ea ducimus adipisci voluptas deleniti reiciendis placeat
            ad eligendi, quae voluptatem eum iure? Voluptas repellat porro id,
            odit amet magnam ex dolor cupiditate molestias harum dignissimos
            aliquid dicta rem cumque deserunt fugiat vel velit ipsum sed? A
            reiciendis ab iure error at quod ad tenetur explicabo, dignissimos
            corrupti earum laboriosam, voluptas dolor repellat ratione ipsum
            consequatur nesciunt! Quo dicta aspernatur eaque nihil in amet!
            Dicta impedit quaerat in molestiae quod debitis reprehenderit quos,
            blanditiis ratione recusandae quisquam excepturi inventore placeat
            facere porro et, veritatis esse nemo est! Quam nam, minima sunt
            placeat dignissimos nulla quas, accusamus mollitia reprehenderit
            veniam distinctio qui impedit dicta eos aperiam doloremque atque
            aliquid voluptatibus id vitae assumenda delectus animi? Ad eligendi
            beatae accusamus in aspernatur architecto tempora suscipit? Vel
            distinctio illum, incidunt accusamus earum ratione, dolor, aliquam
            saepe quaerat harum reiciendis non quis velit illo a nisi.
            Voluptatum nobis eveniet maiores, inventore deleniti nesciunt
            reiciendis eum atque? Dolorem hic exercitationem ab necessitatibus
            laudantium id iste voluptatibus, similique fugiat ipsa, tempore
            expedita accusantium perspiciatis eaque blanditiis? Vero rem dolore
            quisquam voluptates fuga excepturi quod error odio eaque maiores,
            numquam quo earum. Ipsa doloremque repellat quo modi debitis
            nostrum, consectetur facilis dolores esse eum culpa optio eveniet
            vel delectus, neque in. Consequuntur adipisci laborum accusamus
            repudiandae dolores laboriosam ex distinctio alias eaque, quibusdam
            delectus sint quaerat. Incidunt quisquam quia numquam nostrum nam
            nemo impedit nihil, hic dolores quam corrupti dolor, deleniti
            molestias! Dolore repudiandae vel perspiciatis, ab suscipit enim
            quaerat dolorum sunt! Nemo hic, iste tempore mollitia numquam
            quibusdam, architecto laborum, quis odio ducimus eos totam corrupti?
            Autem ea error repellendus quos nostrum tempore maiores quisquam,
            iste atque id voluptate perferendis cupiditate quia laborum officia
            facilis veritatis accusamus sunt rem quod harum totam similique esse
            dolorum! Veritatis similique excepturi at dolor ratione illo. Enim
            consequuntur ipsum, non nostrum nisi deserunt nulla velit sunt
            voluptate reprehenderit hic adipisci, ipsam excepturi quisquam unde
            possimus facere ex qui libero. Velit repellendus magni odit,
            distinctio accusantium dignissimos porro facilis deserunt soluta
            incidunt cum quas nemo. Magnam numquam doloribus, sit veritatis at
            inventore labore, provident nesciunt eligendi sint minima dolore
            facere? Facere officia mollitia, laboriosam voluptates consequuntur
            similique ipsam excepturi consectetur, suscipit, delectus nam
            distinctio autem harum a. Ducimus ipsa sint amet fugiat voluptas
            sapiente laudantium nostrum incidunt illo facere, voluptatum esse
            provident cumque repellendus reprehenderit maiores dolore ratione
            sit ex suscipit? Natus exercitationem beatae odit animi sit
            accusamus consectetur aspernatur labore aliquam dolorem. Corrupti a
            voluptatum placeat illo, ab quidem consequatur repudiandae, sint
            dolores ducimus ut libero fuga vitae quisquam quo tenetur aut, vero
            officiis dignissimos expedita. Officia maxime, modi explicabo illum
            odio, earum nemo quo necessitatibus voluptas et rerum quidem. Quam
            minima sunt fugiat quaerat molestias ea voluptatem aliquid, pariatur
            ab sint animi natus ducimus nostrum, earum accusamus sit sed
            aspernatur accusantium modi aperiam tenetur quibusdam repellat quo
            iste? Consequatur nihil necessitatibus explicabo accusantium enim
            nisi reiciendis quasi sint assumenda fugit, hic omnis debitis
            laborum vel nulla dolorem sapiente ea accusamus cum nesciunt
            voluptates repellendus nobis facilis laudantium! Necessitatibus,
            ratione quisquam perspiciatis voluptatum, explicabo quae quo saepe
            reprehenderit nulla tempora, cum illum cumque modi laborum incidunt
            temporibus cupiditate dolor a voluptate possimus. Et harum adipisci
            id iure voluptas, voluptatum repudiandae provident eum tempora
            dolore. Quisquam earum ea nemo ex, a debitis quod nobis fugiat porro
            voluptatibus adipisci perspiciatis ab quibusdam dolor asperiores
            omnis? Ab molestias tempore quas praesentium beatae ipsa, placeat
            officia vitae optio ipsum, a nam facere corporis consequuntur odit
            at quisquam quos aliquam quae maxime labore eligendi? Labore
            reprehenderit nobis quos autem. Repudiandae architecto, earum a at
            dicta fuga veritatis quas voluptatem. Similique sit quia beatae
            omnis fugit ullam minus ducimus excepturi obcaecati asperiores,
            adipisci autem quibusdam voluptates exercitationem rem et ipsam
            ipsum. Accusamus magni laudantium corporis commodi animi! Recusandae
            enim asperiores tempora nemo numquam facilis hic reprehenderit
            tempore exercitationem dolor aperiam, eaque, beatae et in velit.
            Blanditiis vel aliquid sed quas? Assumenda provident repudiandae
            architecto illum at, voluptatem quaerat error quam saepe veniam
            deleniti consectetur libero sunt expedita aspernatur? Deserunt animi
            corporis officiis reprehenderit amet et eius modi sequi! Rerum
            voluptatum ea facilis reiciendis laudantium id a doloremque iusto.
            Quidem, harum reiciendis at molestias eligendi fuga rerum, sapiente
            impedit delectus magni quis exercitationem accusantium ipsa porro
            odio recusandae corporis aspernatur libero id in? Velit ducimus
            fugiat quisquam minus repellendus accusantium aliquid unde
            blanditiis, incidunt vero molestiae qui nemo pariatur dolor
            excepturi delectus quod suscipit itaque laboriosam? Neque obcaecati
            sequi, possimus ea quibusdam earum nisi consequuntur blanditiis quis
            tenetur, cum animi velit eos omnis voluptatem. Illo velit nam
            facere, eaque assumenda, itaque a alias incidunt voluptatum veniam
            cupiditate expedita adipisci, ex quis minus optio architecto saepe
            unde impedit nemo sunt quisquam recusandae. Amet incidunt inventore
            aut sit sunt veritatis repellat similique voluptate corrupti
            repudiandae? Amet, odio quisquam. Sed, commodi. Nesciunt, autem
            corporis aperiam reiciendis, sunt non numquam quisquam, quae
            repellat similique earum commodi!
          </template>
        </my-card>
      </div>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="Document">
// 引入 api
import { getOneArticle } from "@/api/article"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
// 引入 moment
import moment from "@/utils/moment"

// 存储文章
const article = ref<GetOneArticle["data"]>()
// 根据路由判断
const route = useRoute()

// 初始化
onMounted(async () => {
  // 获取文章
  const articles = await getOneArticle(route.params.id as string)
  article.value = articles
})
</script>

<style scoped lang="scss">
$pages-m-t: -30vh;
$header-t: 150px;
$desc-gap: 10px;
$hr-m-hor: 10px;
$author-m: 10px 0;
$icon-m-r: 2px;
$header-h: 300px;
$header-container-h: 200px;
@include content-aside-title(var(--aside-title-icon-bg));
.doc-content {
  // 设置 卡片 阴影
  @include setCardShadow;
}
// 页面区域
.pages {
  margin-top: $pages-m-t;
}
// 头部
.doc-pages-header {
  position: absolute;
  width: 100%;
  height: $header-h;
  top: $header-t;
  z-index: 2;
  // 文本容器
  > .container {
    color: var(--doc-header-color);
    height: $header-container-h;
    display: flex;
    flex-direction: column;
    align-items: center;
    > .title {
      font-size: 40px;
    }
    > .author {
      font-size: 20px;
      margin: $author-m;
    }
    > .desc {
      display: flex;
      flex-direction: column;
      gap: $desc-gap;
      .item {
        display: flex;
        justify-content: center;
        .item-data {
          display: flex;
          align-items: center;
          .label {
            display: flex;
            align-items: center;
          }
          // 跳转链接
          .doc-header-link {
            transition: color var(--primary-during);
            &:hover {
              color: var(--doc-header-link);
            }
          }
          // 图标
          i {
            margin-right: $icon-m-r;
          }
        }
        // 分割线
        .item-hr {
          margin: 0 $hr-m-hor;
        }
      }
    }
  }
  // 动画
  > .header-animate {
    height: $header-h - $header-container-h;
  }
}
</style>
