<template>
  <div class="q-pa-lg">
    <q-card class="my-card q-py-md">
      <q-card-section>
        <div class="row">
          <div class="col-4 q-pa-sm">
            <q-input filled v-model="name" label="Resource name" />
          </div>
          <div class="col-4 q-pa-sm">
            <q-select
              filled
              color="purple-12"
              v-model="type"
              :options="resourceType"
              label="Label"
            />
          </div>
          <div class="col-4 q-pa-sm">
            <q-input filled v-model="ipAddress" label="IP Address" />
          </div>
          <div class="col-4 q-pa-sm">
            <q-input filled v-model="console" label="Console" />
          </div>
          <div class="col-4 q-pa-sm">
            <q-input filled v-model="mgmtport" label="MGMT Port" />
          </div>
          <div class="col-4 q-pa-sm">
            <q-input filled v-model="model" label="Model" />
          </div>
          <div class="col-4 q-pa-sm">
            <q-input filled v-model="aca" label="ACA" />
          </div>
        </div>
        <div class="q-px-sm q-pt-md">
          <q-btn
            label="Submit"
            type="submit"
            @click="onSubmit"
            color="primary"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-card-section>
    </q-card>

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
        <div class="q-pa-sm row full-width">
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
        </div>
      </template>
      <!-- <template v-slot:body-cell-serial="props">
        <q-td :props="props">{{ props.pageIndex + 1 }}</q-td>
      </template> -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-btn
            color="secondary"
            @click="openBookingModal(props.row.id)"
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
            @click="openResourceDetailsModal(props.row.id)"
            icon-right="visibility"
            size="sm"
          />
          <q-btn
            color="primary"
            @click="editResource(props.row.id)"
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

  <q-dialog v-model="openCommonDialog" :persistent="true">
    <q-card class="q-pa-md" style="width: 670px; max-width: 80vw">
      <q-card-section class="row q-pa-none q-pb-md">
        <div class="text-h6" v-if="bookingModalElement">
          Select the booking date
        </div>
        <div class="text-h6" v-if="resourceModalElement">Resource details</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="closeCommonModal"
          v-close-popup
        />
      </q-card-section>
      <div class="row" v-if="bookingModalElement">
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
            <q-btn
              label="Book Now"
              type="submit"
              class="q-ml-sm"
              color="secondary"
            />
            <q-btn label="Clear" type="submit" color="brown-5" />
          </div>
        </div>
      </div>
      <div class="row" v-if="resourceModalElement">
        <div class="col-3 q-pt-sm">Name</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.name }}</div>

        <div class="col-3 q-pt-sm">Type</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.type }}</div>

        <div class="col-3 q-pt-sm">IP Address</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.ipAddress }}</div>

        <div class="col-3 q-pt-sm">Console</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.console }}</div>

        <div class="col-3 q-pt-sm">MGMT Port</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.mgmtport }}</div>

        <div class="col-3 q-pt-sm">Model</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.model }}</div>

        <div class="col-3 q-pt-sm">ACA</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.aca }}</div>

        <!-- <div class="col-3 q-pt-sm">Status</div>
        <div class="col-9 q-pt-sm">{{ GET_RESOURCE_DETAILS.data }}</div> -->

        <div class="col-3 q-pt-sm">Team</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.team }}</div>

        <div class="col-3 q-pt-sm">Description</div>
        <div class="col-9 q-pt-sm">{{ resourceItemDetails.description }}</div>
      </div>
      <div class="row reverse">
        <q-btn
          label="Close"
          type="submit"
          v-close-popup
          @click="closeCommonModal"
          color="primary"
        />
      </div>
    </q-card>
  </q-dialog>
</template>


<script>
import { exportFile, useQuasar } from "quasar";
import { defineComponent, watch } from "vue";
import { mapActions, mapGetters } from "vuex";
import resourcetableHeader from "@/utils/table/resourceHeader";
import { teams, resourceType } from "@/utils/constant";
import { validateEmail, notifyAlert } from "@/utils/helper";

export default defineComponent({
  name: "ResouceList",
  data() {
    return {
      openCommonDialog: false,
      days: [],
      selectedTeam: null,
      teams: teams,
      resourceType: resourceType,
      filter: "",
      bookingModalElement: false,
      resourceModalElement: false,
      name: "",
      type: "",
      ipAddress: "",
      console: "",
      mgmtport: "",
      model: "",
      aca: "",
      editId: null,
      resourceItemDetails: [],
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
    ...mapGetters("resource", ["GET_RESOURCES", "GET_RESOURCE_DETAILS"]),
  },
  methods: {
    ...mapActions("resource", ["fetchAll", "createResource", "updateResource"]),

    editResource(id) {
      this.editId = id;
      const getEditResource = this.GET_RESOURCES.find((item) => item.id == id);
      this.name = getEditResource.name;
      this.type = getEditResource.type;
      this.ipAddress = getEditResource.ipAddress;
      this.console = getEditResource.console;
      this.mgmtport = getEditResource.mgmtport;
      this.model = getEditResource.model;
      this.aca = getEditResource.aca;
    },

    async onSubmit() {
      const payload = {
        name: this.name,
        type: this.type,
        ipAddress: this.ipAddress,
        console: this.console,
        mgmtport: this.mgmtport,
        model: this.model,
        aca: this.aca,
      };

      try {
        if (this.editId) {
          const result = await this.updateResource({
            id: this.editId,
            payload: payload,
          });
          if (result.status == 200) {
            notifyAlert("positive", "Resource updated successfully");
          }
          this.editId = null;
          this.clearForm();
        } else {
          const result = await this.createResource(payload);
          if (result.status == 200) {
            notifyAlert("positive", "Resource created successfully");
          }
          this.clearForm();
        }
      } catch (e) {}
    },

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
    openBookingModal(id) {
      this.openCommonDialog = true;
      this.bookingModalElement = true;
    },
    openResourceDetailsModal(id) {
      this.openCommonDialog = true;
      this.resourceModalElement = true;
      this.resourceItemDetails = this.GET_RESOURCES.find(
        (item) => item.id == id
      );
    },
    closeCommonModal() {
      setTimeout(() => {
        this.bookingModalElement = false;
        this.resourceModalElement = false;
        this.resourceItemDetails = [];
      }, 800);
    },
    clearForm() {
      this.name = null;
      this.type = null;
      this.ipAddress = null;
      this.console = null;
      this.mgmtport = null;
      this.model = null;
      this.aca = null;
    },
  },
  watch: {
    // openCommonDialog() {
    //   this.bookingForm = true;
    // },
  },
});
</script>