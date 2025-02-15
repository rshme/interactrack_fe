<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-analytics" v-if="!error">
    <div class="vx-row">
      <!-- CARD 1: CONGRATS -->
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <vx-card
          slot="no-body"
          class="text-center bg-primary-gradient greet-user"
        >
          <img
            src="@/assets/images/elements/decore-left.png"
            class="decore-left"
            alt="Decore Left"
            width="200"
          />
          <img
            src="@/assets/images/elements/decore-right.png"
            class="decore-right"
            alt="Decore Right"
            width="175"
          />
          <feather-icon
            icon="AwardIcon"
            class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow"
            svgClasses="h-8 w-8"
          ></feather-icon>
          <h1 class="mb-6 text-white">
            Congratulations {{ checkpointReward.userName }},
          </h1>
          <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white">
            You have done <strong>{{ checkpointReward.progress }}</strong> more
            sales today. Check your new badge in your profile.
          </p>
        </vx-card>
      </div>

      <!-- CARD 2: SUBSCRIBERS GAINED -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="UsersIcon"
          :statistic="total_interaction_completed"
          statisticTitle="Interaction Completed"
          type="area"
        ></statistics-card-line>
      </div>

      <!-- CARD 3: ORDER RECIEVED -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="ShoppingBagIcon"
          :statistic="total_invoice_paid"
          statisticTitle="Invoice Paid"
          color="warning"
          type="area"
        ></statistics-card-line>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-1/2">
        <!-- Sales Funnel Chart -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Sales Funnel</h3>
          <vue-apex-charts
            type="bar"
            height="350"
            :options="funnelOptions"
            :series="funnelSeries"
          />
        </div>
      </div>

      <div class="vx-col w-1/2">
        <!-- Conversion Rates Chart -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Conversion Rates</h3>
          <vue-apex-charts
            type="bar"
            height="350"
            :options="conversionOptions"
            :series="conversionSeries"
          />
        </div>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-1/2">
        <!-- Top Customers CLV Chart -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Top Customers by CLV</h3>
          <vue-apex-charts
            type="bar"
            height="350"
            :options="clvOptions"
            :series="clvSeries"
          />
        </div>
      </div>

      <div class="vx-col w-1/2">
        <!-- Customer Segments Chart -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Customer Segments</h3>
          <vue-apex-charts
            type="pie"
            height="350"
            :options="segmentOptions"
            :series="segmentSeries"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div v-if="loading" class="col-span-2 text-center py-8">
        <p class="text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js";
import VueApexCharts from "vue-apexcharts";
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import { ThumbsDownIcon } from "vue-feather-icons";

export default {
  data() {
    return {
      checkpointReward: {},
      total_invoice_paid: 0,
      total_interaction_completed: 0,

      loading: true,
      dashboardData: null,
      error: null,
    };
  },
  components: {
    VueApexCharts,
    StatisticsCardLine,
  },
  created() {
    //  User Reward Card
    this.$http
      .get("/api/user/checkpoint-reward")
      .then((response) => {
        this.checkpointReward = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await axios.get("/dashboard/get-analytics");
        if (response.data.code_status === 200) {
          this.total_interaction_completed =
            response.data.data.total_interaction_completed;
          this.total_invoice_paid = response.data.data.total_invoice_paid;
          this.dashboardData = response.data.data;

          this.loading = false;
        } else {
          this.error = "Failed to load dashboard data";
        }
      } catch (error) {
        this.$vs.notify({
          title: "Unauthorized",
          text: "Only admin can access the dashboard data !",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });

        this.error = "Error fetching dashboard data";
      }
    },
  },
  computed: {
    // Sales Funnel Chart
    funnelOptions() {
      return {
        chart: {
          type: "funnel",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        colors: ["#00B5B5", "#0094FF", "#FFB547", "#00E396", "#FF4560"],
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
        },
        title: {
          text: "Sales Pipeline",
          align: "center",
        },
        xaxis: {
          categories: [
            "Prospects",
            "Negotiations",
            "Proposals",
            "Won Deals",
            "Lost Deals",
          ],
        },
      };
    },
    funnelSeries() {
      if (!this.dashboardData) return [];
      const { sales_funnel } = this.dashboardData;
      return [
        {
          name: "Count",
          data: [
            sales_funnel.prospects,
            sales_funnel.negotiations,
            sales_funnel.proposals,
            sales_funnel.won_deals,
            sales_funnel.lost_deals,
          ],
        },
      ];
    },

    // Conversion Rates Chart
    conversionOptions() {
      return {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(2) + "%";
          },
          offsetY: -20,
        },
        colors: ["#0094FF"],
        xaxis: {
          categories: ["Prospect to Negotiation", "Negotiation to Won"],
          position: "bottom",
        },
        title: {
          text: "Conversion Rates",
          align: "center",
        },
      };
    },
    conversionSeries() {
      if (!this.dashboardData) return [];
      const { conversion_rates } = this.dashboardData.sales_funnel;
      return [
        {
          name: "Conversion Rate",
          data: [
            conversion_rates.prospect_to_negotiation,
            conversion_rates.negotiation_to_won,
          ],
        },
      ];
    },

    // Top Customers CLV Chart
    clvOptions() {
      return {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 6,
          },
        },
        colors: ["#00B5B5"],
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return "$" + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
        title: {
          text: "Customer Lifetime Value",
          align: "center",
        },
        xaxis: {
          categories: this.dashboardData
            ? this.dashboardData.top_customers_by_clv
                .slice(0, 5)
                .map((customer) => customer.full_name)
            : [],
        },
      };
    },
    clvSeries() {
      if (!this.dashboardData) return [];
      return [
        {
          name: "CLV",
          data: this.dashboardData.top_customers_by_clv
            .slice(0, 5)
            .map((customer) => customer.clv),
        },
      ];
    },

    // Customer Segments Chart
    segmentOptions() {
      return {
        chart: {
          type: "pie",
        },
        labels: ["Potential Loyalists", "At Risk", "Loyal Customers"],
        colors: ["#00B5B5", "#FF4560", "#00E396"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        title: {
          text: "Customer Segments Distribution",
          align: "center",
        },
      };
    },
    segmentSeries() {
      if (!this.dashboardData) return [];
      const { customer_segments } = this.dashboardData;
      return [
        customer_segments.potential_loyalists.count,
        customer_segments.at_risk.count,
        customer_segments.loyal_customers.count,
      ];
    },
  },
};
</script>

<style lang="scss">
/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user {
    position: relative;

    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }
    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 576px) {
    .decore-left,
    .decore-right {
      width: 140px;
    }
  }
}
/*! rtl:end:ignore */
</style>
