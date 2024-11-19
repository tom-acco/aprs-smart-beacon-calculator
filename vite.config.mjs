// Plugins
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import Fonts from "unplugin-fonts/vite"
import Layouts from "vite-plugin-vue-layouts"
import Vue from "@vitejs/plugin-vue"
import VueRouter from "unplugin-vue-router/vite"
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// Utilities
import { defineConfig } from "vite"
import vueDevTools from "vite-plugin-vue-devtools"
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
    base: "aprs-smart-beacon-calculator",
    build: {
        outDir: "./dist"
    },
    plugins: [
        VueRouter(),

        Layouts(),

        Vue({
            template: {
                transformAssetUrls
            }
        }),
    
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true
        }),

        Components(),

        Fonts({
            google: {
                families: [{
                    name: "Roboto",
                    styles: "wght@100;300;400;500;700;900",
                }],
            },
        }),

        AutoImport({
            imports: [
                "vue",
                "vue-router",
            ],
            eslintrc: {
                enabled: true,
            },
            vueTemplate: true,
        }),
        
        vueDevTools()
    ],

    define: {
        "process.env": {}
    },

    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        },
        extensions: [
        ".js",
        ".json",
        ".jsx",
        ".mjs",
        ".ts",
        ".tsx",
        ".vue",
        ],
    },

    server: {
        host: "127.0.0.1",
        port: 3000,
    }
})
