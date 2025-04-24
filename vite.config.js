import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import purgeCss from 'vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig({
  // eslint-disable-next-line no-undef
  base: process.env.NODE_ENV === 'production' ? '/D4_SecretRoomSearch/' : '/', // 忽略未使用 process 的 eslint 提示

  plugins: [
    react(),
    purgeCss({
      // ✅ 掃描以下檔案，找出實際有使用到的 class
      content: ['./index.html', './src/**/*.{js,jsx}'],

      // ✅ 保留這些 class（即使 purgeCss 沒在 content 裡掃到，也不會刪掉）
      safelist: [
        // ===== Bootstrap 組件類別（防止被誤砍） =====
        /^btn/, /^modal/, /^fade/, /^show/, /^collapse/, /^navbar/,
        /^text-/, /^bg-/, /^alert/, /^d-/, /^justify-/, /^align-/, /^col-/, /^row/,
        /^container/, /^form/, /^card/, /^accordion/, /^nav/, /^dropdown/, /^list-group/,
        /^close/, /^toast/, /^tooltip/, /^popover/, /^placeholders/, /^shadow/,

        // ===== Bootstrap 工具輔助類別 =====
        /^position-/, /^top-/, /^bottom-/, /^start-/, /^end-/,
        /^m[trblxy]?-/, /^p[trblxy]?-/, // margin / padding 全系列
        /^z-/,

        // ===== React Loading 套件樣式 =====
        /^loading/,

        // ===== Swiper 套件樣式 =====
        /^swiper/, /^swiper-/, /^swiper-slide/, /^swiper-wrapper/,
        /^swiper-pagination/, /^swiper-button/, /^swiper-scrollbar/,

        // ===== 自定義命名規則（custom- 開頭） =====
        /^custom/,
      ],
    }),
  ],
})
