<template>
    <Line :id="chartId" :options="chartData.options" :data="chartData.data" :height="height"></Line>
</template>

<script>
    import { Line } from "vue-chartjs";
    import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

    ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

    export default {
        name: "line-chart",
        
        setup(){

        },

        props: [
            "chartId",
            "chartData",
            "height"
        ],

        data() {
            return {

            }
        },

        components: {
            Line
        }
    }
</script>