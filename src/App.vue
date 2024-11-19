<template>
  <v-container>
      <v-row>
          <v-col>
              <v-card variant="flat">
                  <v-card-title>Smart Beacon Calculator</v-card-title>
                  <v-card-text>
                      <v-row class="mt-2">
                          <v-col cols="6" lg="2" md="6" sm="6">
                              <div class="text-caption">High Speed: {{ Math.floor(form.highSpeed) }}km/h</div>
                              <v-slider v-model="form.highSpeed" label="" color="secondary" min="10" max="200" hide-details></v-slider>
                          </v-col>
                          <v-col cols="6" lg="2" md="6" sm="6">
                              <div class="text-caption">Slow Speed: {{ Math.floor(form.lowSpeed) }}km/h</div>
                              <v-slider v-model="form.lowSpeed" label="" color="secondary" min="0" max="80" hide-details></v-slider>
                          </v-col>
                          <v-col cols="6" lg="2" md="6" sm="6">
                              <div class="text-caption">Fast Interval: {{ Math.floor(form.fastInterval) }}s</div>
                              <v-slider v-model="form.fastInterval" label="" color="secondary" min="10" max="300" step="10" hide-details></v-slider>
                          </v-col>
                          <v-col cols="6" lg="2" md="6" sm="6">
                              <div class="text-caption">Slow Interval: {{ Math.floor(form.slowInterval) }}s</div>
                              <v-slider v-model="form.slowInterval" label="" color="secondary" min="60" max="1200" step="10" hide-details></v-slider>
                          </v-col>
                          <v-col cols="12">
                              <v-btn @click="resetToDefault()" color="secondary">Reset to Defaults</v-btn>
                          </v-col>
                      </v-row>

                      <v-divider class="my-6"></v-divider>

                      <v-row>
                          <v-col cols="12">
                              <p class="text-h6">Results</p>
                          </v-col>
                          
                          <v-col cols="12" lg="6">
                              <p class="text-subtitle-1">Old Method</p>
                              <p class="text-caption pb-2">txInterval = (15 * highSpeed) / speed</p>
                              <LineChart chart-id="old" :chart-data="oldCalcLine"></LineChart>
                          </v-col>

                          <v-col cols="12" lg="6">
                              <p class="text-subtitle-1">New Method</p>
                              <p class="text-caption pb-2">txInterval = (fastInterval * highSpeed) / speed</p>
                              <LineChart chart-id="new" :chart-data="newCalcLine"></LineChart>
                          </v-col>
                      </v-row>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
  import LineChart from "@/components/line-chart.vue";

  export default {
      name: "smartbeacon",

      setup(){
          return {
              
          }
      },

      data() {
          return {
              defaults: {
                  highSpeed: 120,
                  lowSpeed: 5,
                  fastInterval: 30,
                  slowInterval: 600,
                  minInterval: 5,
              },

              form: {
                  highSpeed: null,
                  lowSpeed: null,
                  fastInterval: null,
                  slowInterval: null,
                  minInterval: null,
              },

              static: {
                  trackInterval: 15,
              },

              headers: [
                  {
                      title: "Speed (km/h)",
                      value: "speed"
                  },
                  {
                      title: "Interval (seconds)",
                      value: "interval"
                  },
              ]
          }
      },

      methods: {
          resetToDefault(){
              this.form = JSON.parse(JSON.stringify(this.defaults))
          },

          oldCalc(speed){
              let txInterval;

              if(speed >= this.form.highSpeed){
                  txInterval = this.form.fastInterval
              }else{
                  if(speed <= this.form.lowSpeed){
                      txInterval = this.form.slowInterval;
                  }else{
                      if(speed <= 0){
                          speed = 1;
                      }

                      txInterval = (this.static.trackInterval * this.form.highSpeed) / speed;

                      if(txInterval < 5){
                          txInterval = 5;
                      }

                      if(txInterval > this.form.fastInterval){
                          txInterval = this.form.fastInterval;
                      }
                  }
              }

              return Math.floor(txInterval);
          },

          newCalc(speed){
              let txInterval;

              // If the speed is faster than our fast speed, set to fast rate
              if(speed >= this.form.highSpeed){
                  txInterval = this.form.fastInterval;
              }

              // If the speed is slower than our slow speed, set to slow rate
              if(speed <= this.form.lowSpeed){
                  txInterval = this.form.slowInterval;
              }

              // Speed is between the two settings, calculate.
              if(speed > this.form.lowSpeed && speed < this.form.highSpeed){
                  txInterval = ((this.form.fastInterval * this.form.highSpeed) / speed);
              }

              // If the txInterval is slower than our slow rate, set it to the slow rate
              if(txInterval > this.form.slowInterval){
                  txInterval = this.form.slowInterval
              }

              // If the txInterval is faster than our fast rate, set it to the fast rate
              if(txInterval < this.form.fastInterval){
                  txInterval = this.form.fastInterval
              }

              // If the txInterval is faster than 5, set it to 5
              if(txInterval < 5){
                  txInterval = 5;
              }

              return Math.floor(txInterval);
          }
      },

      computed: {
          speeds(){
              let nums = [];

              for(let i = 0; i <= 200; i += 5){
                  nums.push(i);
              }

              return nums;
          },

          oldCalcLine(){
              const labels = [];
              const datasets = [{
                  data: [],
                  backgroundColor: [
                      "rgb(72, 169, 166)",
                  ],
                  label: "Interval (s)",
                  tension: 0.2,
                  borderColor: "rgb(72, 169, 166)",
                  pointRadius: 5
              }];

              for(const speed of this.speeds){
                  labels.push(`${speed}km/h`);
                  datasets[0].data.push(this.oldCalc(speed))
              }

              return {
                  data: {
                      labels: labels,
                      datasets: datasets
                  },
                  options: {
                      maintainAspectRatio: true,
                      responsive: true,
                      plugins: {
                          legend: {
                              display: false,
                          }
                      },
                      scales: {
                          y: {
                              beginAtZero: true,
                              grid: {
                                  display: false
                              },
                              ticks: {
                                  display: true
                              }
                          },
                          x: {
                              grid: {
                                  display: false
                              },
                              ticks: {
                                  display: true
                              },
                              stacked: false
                          }
                      }
                  }
              }
          },

          newCalcLine(){
              const labels = [];
              const datasets = [{
                  data: [],
                  backgroundColor: [
                      "rgb(72, 169, 166)",
                  ],
                  label: "Interval (s)",
                  tension: 0.2,
                  borderColor: "rgb(72, 169, 166)",
                  pointRadius: 5
              }];

              for(const speed of this.speeds){
                  labels.push(`${speed}km/h`);
                  datasets[0].data.push(this.newCalc(speed))
              }

              return {
                  data: {
                      labels: labels,
                      datasets: datasets
                  },
                  options: {
                      maintainAspectRatio: true,
                      responsive: true,
                      plugins: {
                          legend: {
                              display: false,
                          }
                      },
                      scales: {
                          y: {
                              beginAtZero: true,
                              grid: {
                                  display: false
                              },
                              ticks: {
                                  display: true
                              }
                          },
                          x: {
                              grid: {
                                  display: false
                              },
                              ticks: {
                                  display: true
                              },
                              stacked: false
                          }
                      }
                  }
              }
          }
      },

      components: {
          LineChart
      },

      created(){
          this.resetToDefault()
      }
  };
</script>