<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :filter="filter"
      :rows="GET_RESOURCES"
      :columns="columns"
      row-key="name"
      table-header-class="text-h6 text-weight-bold"
      flat
      bordered
      :rows-per-page-options="[14]"
    >
      <template v-slot:top>
        <q-btn color="primary" label="Add Resource" class="text-capitalize" />
        <q-space />
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
          class="q-mr-md"
        />
        <q-input
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!-- <template v-slot:body-cell-serial="props">
        <q-td :props="props">{{ props.pageIndex + 1 }}</q-td>
      </template> -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-btn
            color="secondary"
            @click="bookResource(props.row.id)"
            label="Book Now"
            size="sm"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-bookedBy="props">
        <q-td :props="props">
          {{ props.row.bookingname }} <br />
          {{ props.row.bookingemailId }}
        </q-td>
      </template>
      <template v-slot:body-cell-period="props">
        <q-td :props="props">
          {{ props.row.dateIn }} - {{ props.row.dateOut }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="positive"
            @click="resourceDetails(props.row.id)"
            icon-right="visibility"
            size="sm"
          />
          <q-btn
            color="primary"
            @click="updateResource(props.row.id)"
            icon-right="edit"
            class="q-mx-sm"
            size="sm"
          />
          <q-btn
            color="negative"
            @click="deleteResource(props.row.id)"
            icon-right="delete"
            size="sm"
          />
        </q-td>
      </template>
    </q-table>
  </div>

  <q-dialog v-model="bookingDialog">
    <q-card class="q-pa-md" style="width: 670px; max-width: 80vw">
      <q-card-section class="q-pa-none q-pb-md">
        <div class="text-h6">Select the booking date</div>
      </q-card-section>
      <div class="row">
        <div class="col-6">
          <q-date v-model="days" :options="optionsFn" multiple />
        </div>
        <div class="col-6">
          <div class="q-mb-md">
            <q-select
              outlined
              v-model="selectedTeam"
              :options="teams"
              label="Select Team"
            />
          </div>
          <div class="q-mb-md">
            <q-input outlined placeholder="Description" type="textarea" />
          </div>

          <div class="row reverse">
            <q-btn label="Book Now" type="submit" color="primary" />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>


<script>
import { exportFile, useQuasar } from "quasar";
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import resourcetableHeader from "@/utils/table/resourceHeader";
import { teams } from "@/utils/constant";

export default defineComponent({
  name: "ResouceList",
  data() {
    return {
      bookingDialog: false,
      days: [],
      selectedTeam: null,
      teams: teams,
      filter: "",
      columns: [
        // {
        //   name: "serial",
        //   required: true,
        //   label: "#",
        //   field: "serial",
        //   align: "left",
        // },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "type",
          align: "left",
          label: "Type",
          field: "type",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "ipAddress",
          align: "center",
          label: "IP Address",
          field: "ipAddress",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "console",
          align: "center",
          label: "Console",
          field: "console",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "mgmtport",
          align: "center",
          label: "MGMT Pport",
          field: "mgmtport",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "model",
          align: "center",
          label: "Model",
          field: "model",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "aca",
          align: "center",
          label: "ACA",
          field: "aca",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "status",
          align: "center",
          label: "Status",
          field: "status",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "bookedBy",
          align: "left",
          label: "Booked by	",
          field: "bookedBy",
        },
        {
          name: "period",
          align: "center",
          label: "Period",
          field: "period",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "team",
          align: "center",
          label: "Team",
          field: "team",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "action",
          align: "center",
          label: "Action",
          field: "action",
        },
      ],

      optionsFn(date) {
        const currDate = new Date()
          .toISOString()
          .split("T")[0]
          .replaceAll("-", "/");
        return (
          date >= currDate &&
          date <= "2050/12/31" &&
          !["2023/06/25"].includes(date)
        );
      },
    };
  },
  async mounted() {
    await this.fetchAll();
  },
  computed: {
    ...mapGetters("resource", ["GET_RESOURCES"]),
  },
  methods: {
    ...mapActions("resource", ["fetchAll"]),
    wrapCsvValue(val, formatFn, row) {
      let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

      formatted =
        formatted === void 0 || formatted === null ? "" : String(formatted);

      formatted = formatted.split('"').join('""');

      return `"${formatted}"`;
    },
    exportTable() {
      const content = [this.columns.map((col) => this.wrapCsvValue(col.label))]
        .concat(
          this.rows.map((row) =>
            this.columns
              .map((col) =>
                this.wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("table-export.csv", content, "text/csv");

      if (status !== true) {
        $q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
    bookResource(id) {
      this.bookingDialog = true;
    },
  },
});
</script>