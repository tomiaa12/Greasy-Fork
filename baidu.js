// ==UserScript==
// @name         百度纯净版
// @namespace    http://tampermonkey.net/
// @description  去除百度搜索多余信息,纯净
// @version      0.1
// @description  try to take over the world!
// @author       tomiaa
// @match      *://www.baidu.com/
// @match      *://www.baidu.com/s?*
// @match      *://www.baidu.com/sf/*
// @match      *://image.baidu.com/search/index*
// @match      *://zhidao.baidu.com/search*
// @match      *://wenku.baidu.com/search*
// @match      *://tieba.baidu.com/f*
// @match      *://tieba.baidu.com/

// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @grant        none

// @require    File://F:\WEB\demo.js
// ==/UserScript==
;(() => {
  console.clear();
  const config = {
    'https://www.baidu.com/':{ // index
      remove: [
        '#s-top-left',          // nav 左侧
        '#s-hotsearch-wrapper', // 搜索下面热搜
        '#s_lg_img',            // 百度logo
        '#bottom_layer',        // 底部
        '#s_side_wrapper',      // 右下角
      ]
    },
    /* 搜索结果页 */
    'https://www.baidu.com/s': { // 搜索页
      remove: [
        // '#result_logo',         // 左上角logo
        '#content_right',       // 右侧
        '.s-tab-more',          // 更多
        '.s-tab-b2b',           // 采购
        '#foot',                // 底部
        '.new_nums',            // 找到数量
        '.search_tool_close',   // 收起工具
        '.toindex',             // 右侧返回首页
        /* item底部 */
        '.se_st_footer',        
        '.c-showurl',
        '.kuaizhao',            // 快照
        '.c-icons-outer',       // 保障
        '.op-guide-cont',       // 翻译下载
        '#rs',                  // 相关搜索
      ],
      css:`
      .head_nums_cont_inner{
        top: 0 !important;
      }
      `
    },
    'https://www.baidu.com/sf/vsearch': {   // 视频
      remove: [
        '#content_right',       // 右侧
        '.s-tab-more',          //更多
        '.s-tab-b2b',           // 采购
      ]
    },
    'https://image.baidu.com/search/index': {
      remove: [
        '#tips',      // 提示
        '#topRS',     // 相关搜索
        '#resultInfo',// 数量
        '#common-feedback-link',// 反馈
        '.s_tab_more',          // 更多
        '.s-tab-b2b',           // 采购

      ],
      css: `
      #newImgFilter{
        margin-left: 7rem;
      }
      .hover ._self{ /* 下载 */
        right: 10px;
      }
      .hover .title, /* 标题 */
      .hover .dutu{  /* 识图 */
        display:none !important;
      }
      `
    },
    'https://zhidao.baidu.com/search': { // 知道
      remove: [
        '.fixheight',   // 右侧
        '#footer-help', // 底部
        '.shop-entrance',// 右上角商城
        '.s-tab-b2b',           // 采购
      ]
    },
    "https://wenku.baidu.com/search": { // 文库
      remove: [
        '.base-layout-content-right',   // 右侧
        '.user-vip',                    // 右上角vip立减
        '.user-more',                   //右上角更多
        '.no-full-screen',              // 右下角
        '.baidu-search-tip-wrap',       // 去网页搜索
        '.search-relative-wrapper',     // 相关搜索
        '.cover-img-wrap',              // 底部广告
        '.search-foot-wrap',            // 底部
        '.head-recom',                  // 搜索推荐
      ]
    },
    'https://tieba.baidu.com/f': {   // 贴吧
      remove: [
        '.search_nav',   // 头部
        '.u_hermes',                  // 问题反馈
        '.u_member',                  // 会员
        '.gift-goin',       // gif
        '.card_info',       // 目录
        '.dialogJ',  // 弹窗
        /* 右下角 */
        '.tbui_fbar_down',
        '.tbui_fbar_refresh',
        '.tbui_fbar_share',
        '.tbui_fbar_feedback',
        '.tbui_fbar_favor',
        '#aside',
      ],
      css: `
      #content_wrap{
        width: 100% !important; /* 内容 */
      }
      /* 左侧广告 */
      .clearfix .label_text,
      .clearfix .close_btn,
      .clearfix .j_click_stats,
      .clearfix .hover_btn
      {
        display: none !important;
      }
      #content_wrap
      {
        background: #fff;
      }
      `
    },
    'https://tieba.baidu.com/': {
      remove: [
        // '.top-sec',     // 轮播
        '.search_nav ',  // 顶部
        '.u_menu_member', // 会员
        '#spage-tbshare-container', // 右侧分享
        '.r-top-sec',    // 推荐贴吧
        '.r-right-sec',  // 右侧
        '.spage_liveshow_slide', // 游戏
        '#spage_game_tab_wrapper', // 左侧游戏
        '.aggregate_entrance_wrap', // 左侧 精选
        '.ufw-gap', // 分类
        '#f-d-w', // 分类
        '.footer', // 底部
      ],
      css: `
      #left-cont-wraper {
        position: static !important;
      }
      .top-sec{
        display: none !important;
      }
      `
    }
  }


  const currentHref = location.href.split('?');
  console.log(currentHref);
  class BaiduClear {

    constructor(config){
      this.config = config;
      this.domain = '';
      this.query = null;
      this.init();
    }

    init(){
      const currentHref = location.href.split('?');
      this.domain = currentHref[0];
      this.query = currentHref[1];
      this.removeToHidden(this.config?.[this.domain]?.remove);
      this.addCss(this.config?.[this.domain]?.css);
      this.remove(this.config?.[this.domain]?.remove);

    }

    static $(id) { return document.querySelector(id) }

    remove(arr = []){
      arr.map(item => BaiduClear.$(item)).forEach(item => {
        item?.remove();
      })
    }

    removeToHidden(arr = []){
      if(!arr.length) return;
      this.addCss(arr.join(',') + `{display: none;}`)
    }

    addCss(css = ''){
      if(!css) return;
      let  style = document.createElement('style')
      style.innerHTML = css;
      document.documentElement.appendChild(style);
    }

  }
  new BaiduClear(config);
})()

